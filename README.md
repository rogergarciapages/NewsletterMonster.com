# NewsletterMonster

A Next.js 14 platform for discovering, following, and managing newsletter content. Built with TypeScript, PostgreSQL, and NextUI.
This is the internet newsletter archive.

## Features

- 📱 Responsive three-column layout inspired by modern social platforms
- 🔍 SEO-optimized with server-side rendering
- 👤 User authentication and profile management
- 🏢 Brand profiles with verification system
- 📨 Newsletter content organization and discovery
- 🔔 Follow system for users and brands
- 🖼️ Image optimization and MinIO integration

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- PostgreSQL with Prisma ORM
- NextAuth.js
- NextUI & Tailwind CSS
- MinIO for image storage
- Zod for validation

## Getting Started

```bash
# Clone repository
git clone https://github.com/rogergarciapages/newslettermonsterbeta.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
```

## Features in Detail

### User Management

- Profile creation and editing
- Social media integration
- Profile image upload

### Brand System

- Brand profile claiming
- Domain verification
- Verified badge system

### Newsletter Management

- Content organization
- SEO-friendly URLs
- Tag system

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## License

[MIT](LICENSE)
