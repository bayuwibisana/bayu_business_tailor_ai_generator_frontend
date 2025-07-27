# Social Media Content Generator - Frontend

Next.js frontend for the Social Media Content Generator application.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your backend API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── app/                 # Next.js app router pages
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and API client
└── public/             # Static assets
```

## Features

- User authentication (login/logout)
- Campaign management
- Batch content generation
- Real-time progress tracking
- Responsive design
