def extract_brand_info(self, sender_email: str, sender_name: str) -> Dict[str, str]:
    """Extract brand information from the email sender."""
    # Extract domain from email
    domain = sender_email.split('@')[1] if '@' in sender_email else None
    
    # Create brand name from sender name or email
    name = sender_name or sender_email.split('@')[0]
    
    # Create initial slug from the name
    base_slug = self.create_base_slug(name)
    
    return {
        'name': name,
        'slug': base_slug,
        'domain': domain,
        'email': sender_email
    }

def create_base_slug(self, text: str) -> str:
    """Create a base URL-friendly slug from text."""
    # Convert to lowercase and replace spaces/special chars with hyphens
    slug = text.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = slug.strip('-')
    return slug

def get_unique_slug(self, cur, base_slug: str, domain: str = None) -> str:
    """Generate a unique slug for a brand, considering domain if available."""
    # First try the base slug
    slug = base_slug
    counter = 1
    
    while True:
        # Check if this slug is already used
        cur.execute(
            'SELECT domain FROM "Brand" WHERE slug = %s',
            (slug,)
        )
        result = cur.fetchone()
        
        if not result:
            # Slug is unique, we can use it
            return slug
            
        existing_domain = result[0]
        if existing_domain == domain:
            # Same domain means it's the same brand
            return slug
            
        # Add domain-based suffix if available
        if counter == 1 and domain:
            # Extract first part of domain (e.g., 'india' from 'company.india.com')
            domain_parts = domain.split('.')
            if len(domain_parts) > 2:
                location_hint = domain_parts[-3]  # Get the subdomain
                slug = f"{base_slug}-{location_hint}"
                counter += 1
                continue
                
        # If still not unique or no domain available, add number
        slug = f"{base_slug}-{counter}"
        counter += 1

def get_or_create_brand(self, cur, brand_info: Dict[str, str]) -> str:
    """Get existing brand or create a new one with unique slug."""
    try:
        # First try to find by domain (most specific identifier)
        if brand_info['domain']:
            cur.execute(
                'SELECT brand_id FROM "Brand" WHERE domain = %s',
                (brand_info['domain'],)
            )
            result = cur.fetchone()
            if result:
                return result[0]
        
        # Then try to find by email pattern
        email_domain = brand_info['email'].split('@')[1]
        cur.execute(
            'SELECT brand_id FROM "Brand" WHERE domain LIKE %s',
            (f'%.{email_domain}',)
        )
        result = cur.fetchone()
        if result:
            return result[0]
        
        # Generate unique slug
        unique_slug = self.get_unique_slug(cur, brand_info['slug'], brand_info['domain'])
        
        # Create new brand with unique slug
        cur.execute(
            '''INSERT INTO "Brand" (
                name, slug, domain, is_claimed, is_verified,
                created_at, updated_at, email_pattern
            ) VALUES (%s, %s, %s, false, false, NOW(), NOW(), %s)
            RETURNING brand_id''',
            (
                brand_info['name'],
                unique_slug,
                brand_info['domain'],
                f"@{email_domain}"  # Store email pattern for future matching
            )
        )
        
        brand_id = cur.fetchone()[0]
        logger.info(f"Created new brand: {brand_info['name']} (ID: {brand_id}, slug: {unique_slug})")
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