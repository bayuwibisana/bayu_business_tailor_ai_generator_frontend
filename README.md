# Social Media Content Generator

A modern web application for generating Instagram posts using AI. Create campaigns, generate content in batches, and manage your social media content efficiently.

## 🚀 Features Implemented

### Authentication & Security
- **User Authentication**: Secure login/logout system with JWT tokens
- **Protected Routes**: Dashboard requires authentication
- **Session Management**: Automatic token handling and refresh
- **Logout Functionality**: Secure logout with token cleanup

### Campaign Management
- **Campaign Creation**: Create campaigns with brand settings, tone, and target audience
- **Campaign List**: View all campaigns with collapsible interface
- **Campaign Selection**: Choose campaigns for content generation
- **Campaign Details**: Store brand name, description, tone, and target audience

### Content Generation
- **Batch Generation**: Generate 1-100 Instagram posts simultaneously
- **AI-Powered Content**: Uses OpenAI GPT-4 for caption and image generation
- **Real-time Progress Tracking**: Live progress updates with completion status
- **Iterative Content**: Each post gets unique identifiers (Post 1, Post 2, etc.)
- **Flexible Generation**: Choose number of posts and campaign settings

### User Interface
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface using Tailwind CSS
- **Collapsible Components**: Campaign list can be collapsed for better space management
- **Loading States**: Proper loading indicators and error handling
- **Form Validation**: Client-side validation for all inputs

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **UI Components**: Radix UI for accessible components
- **State Management**: React hooks for local state
- **HTTP Client**: Axios for API communication
- **Icons**: Lucide React for consistent iconography

### Backend Integration
- **API**: FastAPI (Python) backend
- **Database**: PostgreSQL for data persistence
- **Authentication**: JWT token-based authentication
- **AI Services**: OpenAI GPT-4 for content generation

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint for code quality
- **Type Checking**: TypeScript compiler
- **Hot Reload**: Next.js development server

## 📋 Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Package manager (comes with Node.js)
- **Backend Server**: FastAPI backend running on port 8000
- **Database**: PostgreSQL database with proper schema
- **OpenAI API**: Valid API key for content generation

## 🚀 Installation and Setup

### 1. Clone the Repository
```bash
mkdir social-media-generator/frontend
cd social-media-generator/frontend
git clone <your-repository-url> .
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the frontend directory:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your backend API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Access the Application
Open [http://localhost:3000](http://localhost:3000) in your browser.

The application will automatically redirect to the login page.

## 📖 How to Run the Application

### Development Mode
```bash
npm run dev
```
- Starts development server on port 3000
- Hot reload enabled for instant updates
- Detailed error messages and debugging

### Production Build
```bash
npm run build
npm start
```
- Creates optimized production build
- Serves static files efficiently
- Better performance and smaller bundle size

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## 🏗 Project Structure

```
frontend/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Dashboard page (protected)
│   ├── login/            # Login page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page (redirects to login)
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── batch-generator.tsx
│   ├── campaign-form.tsx
│   ├── campaign-list.tsx
│   ├── content-generator-form.tsx
│   └── progress-tracker.tsx
├── hooks/                # Custom React hooks
│   └── use-auth.ts       # Authentication hook
├── lib/                  # Utilities and services
│   └── api.ts           # API client configuration
└── public/              # Static assets
```

## 🔌 API Integration

### Authentication Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout

### Campaign Management
- `GET /api/campaigns` - Fetch user campaigns
- `POST /api/campaigns` - Create new campaign

### Content Generation
- `POST /api/campaigns/{id}/generate-batch` - Start batch generation
- `GET /api/batch-jobs/{job_id}/status` - Get generation progress
- `GET /api/batch-jobs/{job_id}/results` - Get generation results

## 🎨 Design Decisions

### Architecture
- **Component-Based**: Modular React components for reusability
- **Hook-Based State**: Custom hooks for authentication and API calls
- **Type Safety**: TypeScript throughout for better development experience
- **API-First**: Clear separation between frontend and backend

### User Experience
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Loading States**: Clear feedback during async operations
- **Error Handling**: Graceful error messages and recovery
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Security
- **Client-Side Protection**: Route guards for authenticated pages
- **Token Management**: Automatic token handling and cleanup
- **Input Validation**: Client-side validation with proper error messages
- **Secure Logout**: Proper token removal and session cleanup

### Performance
- **Code Splitting**: Automatic by Next.js for optimal loading
- **Image Optimization**: Next.js Image component for optimized images
- **Bundle Optimization**: Tree shaking and minification in production
- **Caching**: Strategic caching for API responses

## 🔧 Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Next.js Configuration
- **React Strict Mode**: Enabled for better development experience
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality enforcement
- **Tailwind CSS**: Utility-first CSS framework

## 🧪 Testing

### Manual Testing Checklist
- [ ] User authentication (login/logout)
- [ ] Campaign creation and listing
- [ ] Content generation with progress tracking
- [ ] Responsive design on different screen sizes
- [ ] Error handling and validation
- [ ] Collapsible campaign list functionality

### Browser Compatibility
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
1. Build the application: `npm run build`
2. Set environment variables
3. Deploy the `out` directory to your hosting platform

## 🆘 Troubleshooting

### Common Issues

**Authentication Errors**
- Verify backend server is running on port 8000
- Check environment variables are set correctly
- Ensure JWT tokens are being sent in requests

**API Connection Issues**
- Confirm `NEXT_PUBLIC_API_URL` is set correctly
- Check backend server is accessible
- Verify CORS settings on backend

**Build Errors**
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`

### Development Tips
- Use browser developer tools for debugging
- Check Network tab for API request/response issues
- Monitor Console for JavaScript errors
- Use React Developer Tools for component debugging

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 🔄 Updates and Maintenance

- **Dependencies**: Regularly update npm packages for security
- **Next.js**: Keep up with Next.js updates for new features
- **TypeScript**: Update TypeScript for better type safety
- **Security**: Monitor for security vulnerabilities in dependencies
