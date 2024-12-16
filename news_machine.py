import anthropic
from anthropic import Anthropic

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
                brand_id, name, slug, domain, 
                is_claimed, is_verified,
                created_at, updated_at
            ) VALUES (
                gen_random_uuid(), %s, %s, %s, 
                false, false, 
                NOW(), NOW()
            )
            RETURNING brand_id''',
            (
                brand_info['name'],
                unique_slug,
                brand_info['domain']
            )
        )
        
        brand_id = cur.fetchone()[0]
        
        # Create social links entry for the brand
        cur.execute(
            '''INSERT INTO "SocialLinks" (
                id, brand_id
            ) VALUES (
                gen_random_uuid(), %s
            )''',
            (brand_id,)
        )
        
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

async def _generate_content_with_gemini(self, text_content: str, subject: str) -> Dict:
    """Try to generate content using Gemini API."""
    try:
        prompt = f"Subject: {subject}\n\nContent: {text_content}\n\n{self.system_prompt}"
        response = await self.model.generate_content_async(prompt)
        
        # Parse the response into structured data
        lines = response.text.split('\n')
        result = {}
        current_key = None
        
        for line in lines:
            if line.startswith('Summary:'):
                current_key = 'summary'
                result[current_key] = line.replace('Summary:', '').strip()
            elif line.startswith('Tags:'):
                current_key = 'tags'
                tags_text = line.replace('Tags:', '').strip()
                result[current_key] = [tag.strip() for tag in tags_text.split(',')]
            elif line.startswith('Products:'):
                current_key = 'products'
                products_text = line.replace('Products:', '').strip()
                result[current_key] = [prod.strip() for prod in products_text.split(',')]
            elif line.startswith('Key Insights:'):
                current_key = 'insights'
                result[current_key] = []
            elif current_key == 'insights' and line.strip().startswith('-'):
                result[current_key].append(line.strip()[2:])
            elif current_key and line.strip():
                if isinstance(result[current_key], list):
                    result[current_key].append(line.strip())
                else:
                    result[current_key] += ' ' + line.strip()
        
        return result
        
    except Exception as e:
        logger.error(f"Gemini API error: {e}")
        return None

async def _generate_content_with_anthropic(self, text_content: str, subject: str) -> Dict:
    """Try to generate content using Anthropic API."""
    try:
        prompt = f"Subject: {subject}\n\nContent: {text_content}\n\n{self.system_prompt}"
        
        message = await self.anthropic.messages.create(
            model="claude-3-opus-20240229",
            max_tokens=1000,
            messages=[{
                "role": "user",
                "content": prompt
            }]
        )
        
        # Parse the response into structured data
        lines = message.content[0].text.split('\n')
        result = {}
        current_key = None
        
        for line in lines:
            if line.startswith('Summary:'):
                current_key = 'summary'
                result[current_key] = line.replace('Summary:', '').strip()
            elif line.startswith('Tags:'):
                current_key = 'tags'
                tags_text = line.replace('Tags:', '').strip()
                result[current_key] = [tag.strip() for tag in tags_text.split(',')]
            elif line.startswith('Products:'):
                current_key = 'products'
                products_text = line.replace('Products:', '').strip()
                result[current_key] = [prod.strip() for prod in products_text.split(',')]
            elif line.startswith('Key Insights:'):
                current_key = 'insights'
                result[current_key] = []
            elif current_key == 'insights' and line.strip().startswith('-'):
                result[current_key].append(line.strip()[2:])
            elif current_key and line.strip():
                if isinstance(result[current_key], list):
                    result[current_key].append(line.strip())
                else:
                    result[current_key] += ' ' + line.strip()
        
        return result
        
    except Exception as e:
        logger.error(f"Anthropic API error: {e}")
        return None

async def process_email(self, email_content: str, subject: str) -> Dict:
    """Process raw email content and extract structured information."""
    soup = BeautifulSoup(email_content, 'html.parser')
    text_content = self._extract_text_with_structure(soup)
    
    # Try Gemini first
    analysis = await self._generate_content_with_gemini(text_content, subject)
    
    # If Gemini fails, try Anthropic
    if analysis is None:
        logger.info("Gemini API failed, falling back to Anthropic API")
        analysis = await self._generate_content_with_anthropic(text_content, subject)
        
    # If both APIs fail, return minimal structure
    if analysis is None:
        logger.error("Both Gemini and Anthropic APIs failed")
        analysis = {
            'summary': f"Failed to generate summary for: {subject}",
            'tags': [],
            'products': [],
            'insights': []
        }
    
    return {
        'content': text_content,
        'analysis': analysis,
        'processed_at': datetime.now(timezone.utc).isoformat()
    } 