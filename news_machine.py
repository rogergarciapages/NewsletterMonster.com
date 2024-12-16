def extract_brand_info(self, sender_email: str, sender_name: str) -> Dict[str, str]:
    """Extract brand information from the email sender."""
    # Extract domain from email
    domain = sender_email.split('@')[1] if '@' in sender_email else None
    
    # Create brand name from sender name or email
    name = sender_name or sender_email.split('@')[0]
    
    # Create a slug from the name
    slug = self.create_slug(name)
    
    return {
        'name': name,
        'slug': slug,
        'domain': domain,
        'email': sender_email
    }

def create_slug(self, text: str) -> str:
    """Create a URL-friendly slug from text."""
    # Convert to lowercase and replace spaces/special chars with hyphens
    slug = text.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = slug.strip('-')
    return slug

def get_or_create_brand(self, cur, brand_info: Dict[str, str]) -> str:
    """Get existing brand or create a new one."""
    try:
        # First try to find by slug
        cur.execute(
            'SELECT brand_id FROM "Brand" WHERE slug = %s',
            (brand_info['slug'],)
        )
        result = cur.fetchone()
        
        if result:
            return result[0]
            
        # If not found, try by domain
        if brand_info['domain']:
            cur.execute(
                'SELECT brand_id FROM "Brand" WHERE domain = %s',
                (brand_info['domain'],)
            )
            result = cur.fetchone()
            
            if result:
                return result[0]
        
        # If still not found, create new brand
        cur.execute(
            '''INSERT INTO "Brand" (
                name, slug, domain, is_claimed, is_verified,
                created_at, updated_at
            ) VALUES (%s, %s, %s, false, false, NOW(), NOW())
            RETURNING brand_id''',
            (
                brand_info['name'],
                brand_info['slug'],
                brand_info['domain']
            )
        )
        
        brand_id = cur.fetchone()[0]
        logger.info(f"Created new brand: {brand_info['name']} (ID: {brand_id})")
        return brand_id
        
    except Exception as e:
        logger.error(f"Error in get_or_create_brand: {e}")
        raise

async def process_newsletter(self, email_msg) -> Optional[Dict]:
    """Process a newsletter email and create/update associated brand."""
    try:
        # Extract email information
        subject = decode_header(email_msg['subject'])[0][0]
        if isinstance(subject, bytes):
            subject = subject.decode()
            
        sender_email = email.utils.parseaddr(email_msg['from'])[1]
        sender_name = email.utils.parseaddr(email_msg['from'])[0]
        
        # Get HTML content
        html_content = None
        for part in email_msg.walk():
            if part.get_content_type() == "text/html":
                html_content = part.get_payload(decode=True).decode()
                break
                
        if not html_content:
            logger.warning(f"No HTML content found in email: {subject}")
            return None
            
        # Generate UUID for this newsletter
        newsletter_uuid = str(uuid.uuid4())
        
        # Upload HTML and take screenshots
        html_url = await self.upload_html_and_take_screenshot(html_content, newsletter_uuid)
        
        # Process email content
        processed_data = await self.process_email(html_content, subject)
        
        # Extract brand information
        brand_info = self.extract_brand_info(sender_email, sender_name)
        
        with self.get_db_connection() as conn:
            with conn.cursor() as cur:
                # Get or create brand
                brand_id = self.get_or_create_brand(cur, brand_info)
                
                # Create newsletter entry
                cur.execute(
                    '''INSERT INTO "Newsletter" (
                        newsletter_id, brand_id, sender, sender_slug,
                        subject, html_url, top_screenshot_url,
                        thumbnail_screenshot_url, summary, created_at,
                        updated_at, user_id
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s,
                        %s, %s, %s, NOW(), NOW(), %s
                    ) RETURNING newsletter_id''',
                    (
                        newsletter_uuid,
                        brand_id,
                        brand_info['name'],
                        brand_info['slug'],
                        subject,
                        html_url,
                        f"https://{S3_BUCKET}.s3.{S3_REGION}.amazonaws.com/{newsletter_uuid}/{newsletter_uuid}_full.webp",
                        f"https://{S3_BUCKET}.s3.{S3_REGION}.amazonaws.com/{newsletter_uuid}/{newsletter_uuid}_small.webp",
                        processed_data['analysis'].get('summary', ''),
                        self.get_master_user_id()
                    )
                )
                
                newsletter_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'newsletter_id': newsletter_id,
                    'brand_id': brand_id,
                    'brand_name': brand_info['name'],
                    'brand_slug': brand_info['slug']
                }
                
    except Exception as e:
        logger.error(f"Error processing newsletter: {e}")
        traceback.print_exc()
        return None 