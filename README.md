# Project Haku - Japanese Learning Assistant

Project Haku is an AI-powered Japanese learning assistant that helps users practice and learn Japanese through interactive conversations. Built with Next.js 13, Supabase, and modern web technologies.

## Features

- 🤖 AI-powered Japanese learning assistant
- 💬 Real-time chat interface
- 🔄 Multiple input modes (Normal, Hiragana, Katakana)
- 👤 User authentication with NextAuth.js
- 📊 Usage tracking and subscription tiers
- 🎨 Beautiful UI with Tailwind CSS and shadcn/ui
- 🌙 Dark mode support

## Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account
- Gemini AI API key

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/dazadev/project-haku.git
cd project-haku
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# OAuth Providers (if using)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# OpenAI (if using)
OPENAI_API_KEY=your_openai_api_key
```

4. Set up the Supabase database:
- Create a new Supabase project
- Run the migrations in the `supabase/migrations` folder in order:
  1. `create_chats.sql`
  2. `create_messages.sql`
  3. `create_tracking_chat.sql`
  4. `20240101_update_chat_policies.sql`
  5. `20240101_update_users_policies.sql`

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
project-haku/
├── app/                    # Next.js 13 app directory
│   ├── api/               # API routes
│   ├── chat/             # Chat pages
│   └── page.tsx          # Home page
├── components/            # React components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
├── public/               # Static assets
├── styles/               # Global styles
├── supabase/             # Supabase configurations and migrations
└── types/                # TypeScript type definitions
```

## Key Features Implementation

### Authentication
- Uses NextAuth.js for authentication
- Supports multiple OAuth providers
- Integrates with Supabase for user management

### Chat System
- Real-time message updates
- Support for different input modes
- Message history persistence
- Usage tracking and limits

### Database Schema
- `chats` table for conversation management
- `messages` table for storing chat messages
- Row Level Security (RLS) for data protection
- Usage tracking system

## Deployment

1. Create a production Supabase instance
2. Set up environment variables in your deployment platform
3. Deploy using the Vercel platform or your preferred hosting service

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Acknowledgments

- Next.js team for the amazing framework
- Supabase team for the backend infrastructure
- shadcn/ui for the beautiful components
- All contributors and users of Project Haku
