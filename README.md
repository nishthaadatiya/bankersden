# Bankers Den - Next.js Full Stack Financial Platform

A comprehensive financial services platform built with Next.js 14, featuring loan applications, EMI calculators, AI-powered chatbot, and admin panel. This is a complete migration from the previous React + Node.js architecture to a unified Next.js application.

## 🌟 Features

### 🤖 AI-Powered Chatbot ("den's bots")
- Powered by Google Gemini AI
- Organization-specific knowledge base
- Supports basic math and statistical reasoning
- Admin-managed content (paragraphs and Q&A pairs)

### 👨‍💼 Admin Panel
- MongoDB-based lead management system
- View and manage all loan applications and contact forms
- Change lead status (Active, Processing, Completed)
- Manage chatbot knowledge base
- Secure JWT authentication

### 📊 Enhanced EMI Calculator
- Manual input boxes alongside sliders
- Real-time sync between input methods
- Improved UI/UX with cleaner styling

### 🎨 Modern UI/UX
- Built with Next.js 14 and App Router
- Tailwind CSS for styling
- Responsive design
- Enhanced user experience

## 📁 Project Structure

```
bankersden-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── admin/         # Admin API endpoints
│   │   │   │   ├── leads/     # Lead management
│   │   │   │   └── login/     # Admin authentication
│   │   │   ├── chat/          # Chatbot API
│   │   │   ├── contact/       # Contact form API
│   │   │   ├── health/        # Health check
│   │   │   └── loan-application/ # Loan application API
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout with Header/Footer
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable components
│   │   ├── Header.tsx         # Navigation header
│   │   └── Footer.tsx         # Site footer
│   ├── lib/                   # Utility libraries
│   │   ├── auth.ts           # Authentication utilities
│   │   ├── chatbot.ts        # Chatbot service
│   │   ├── database.ts       # MongoDB connection
│   │   └── whatsapp.ts       # WhatsApp service
│   └── models/               # MongoDB models
│       ├── Admin.ts          # Admin model
│       ├── ChatData.ts       # Chatbot data model
│       └── Lead.ts           # Lead model
├── scripts/
│   └── init-db.js            # Database initialization script
├── .env.local                # Environment variables (local)
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules

├── next.config.js            # Next.js configuration
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Copy the example environment file and configure:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/bankersden

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key-here

# Facebook Meta WhatsApp Business API
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_ACCESS_TOKEN=your-permanent-access-token
WHATSAPP_VERIFY_TOKEN=your-webhook-verify-token
WHATSAPP_BUSINESS_ACCOUNT_ID=your-business-account-id
ADMIN_WHATSAPP=9145023840

# Next.js
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

### 3. Setup MongoDB
Install and start MongoDB locally, or use MongoDB Atlas for cloud hosting.

### 4. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file

### 5. Development Mode
```bash
npm run dev
```

### 6. Access the Application
- **Application**: http://localhost:3000
- **API Health Check**: http://localhost:3000/api/health
- **Admin Panel**: http://localhost:3000/admin/login
  - Username: `admin`
  - Password: `admin123`

## 📱 WhatsApp Integration (Facebook Meta WhatsApp Business API)

The application now uses Facebook Meta WhatsApp Business API for sending notifications to both admin and applicants:

### Features:
- ✅ **Dual Notifications**: Sends messages to both admin and applicant
- ✅ **Admin Notifications**: New applications and contact forms
- ✅ **Applicant Confirmations**: Automatic confirmation messages
- ✅ **Webhook Support**: Handles incoming messages and delivery receipts
- ✅ **Auto-replies**: Business hours auto-responses
- ✅ **Message Tracking**: Delivery status monitoring

### Setup Facebook Meta WhatsApp Business API:

1. **Create Facebook Business Account**
   - Go to [Facebook Business](https://business.facebook.com/)
   - Create or use existing business account

2. **Setup WhatsApp Business API**
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create new app → Business → WhatsApp
   - Add WhatsApp product to your app

3. **Get Required Credentials**
   ```env
   WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
   WHATSAPP_ACCESS_TOKEN=your-permanent-access-token
   WHATSAPP_VERIFY_TOKEN=your-webhook-verify-token
   WHATSAPP_BUSINESS_ACCOUNT_ID=your-business-account-id
   ```

4. **Configure Webhook**
   - Webhook URL: `https://yourdomain.com/api/whatsapp/webhook`
   - Verify Token: Use the same token from `WHATSAPP_VERIFY_TOKEN`
   - Subscribe to: `messages` field

5. **Test Integration**
   - GET `/api/whatsapp/test` - Check configuration
   - POST `/api/whatsapp/test` - Send test message

### Message Flow:
1. **Loan Application**: Admin gets detailed notification, applicant gets confirmation
2. **Contact Form**: Admin gets inquiry details, user gets acknowledgment
3. **Incoming Messages**: Logged and can trigger auto-replies
4. **Delivery Status**: Tracked and logged for monitoring

**Live Website:** https://bankersdens.com

## 🛠 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
1. Build the application:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

### Environment Variables for Production
Make sure to set all environment variables in your hosting platform:
- `MONGODB_URI`
- `JWT_SECRET`
- `GEMINI_API_KEY`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_VERIFY_TOKEN`
- `WHATSAPP_BUSINESS_ACCOUNT_ID`
- `ADMIN_WHATSAPP`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## 🔧 API Endpoints

### Public Endpoints
- `POST /api/contact` - Submit contact form
- `POST /api/loan-application` - Submit loan application
- `POST /api/chat` - Chat with AI bot
- `GET /api/health` - Health check
- `GET /api/whatsapp/test` - Check WhatsApp configuration
- `POST /api/whatsapp/test` - Send test WhatsApp message
- `GET|POST /api/whatsapp/webhook` - WhatsApp webhook endpoint

### Admin Endpoints (Requires Authentication)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/leads` - Get all leads with filtering
- `GET /api/admin/leads/[id]` - Get specific lead
- `PUT /api/admin/leads/[id]/status` - Update lead status

## 🎨 Tech Stack

### Frontend & Backend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Database & Authentication
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing

### AI & External Services
- **Google Gemini AI** for intelligent chatbot responses
- **WhatsApp API** for instant notifications

### Development Tools
- **ESLint** for code linting
- **PostCSS** for CSS processing
- **Autoprefixer** for CSS vendor prefixes

## 🔄 Migration from Previous Architecture

This project has been migrated from a separate React frontend and Node.js backend to a unified Next.js application:

### What Changed:
- ✅ Combined frontend and backend into single Next.js app
- ✅ Converted React Router to Next.js App Router
- ✅ Migrated Express API routes to Next.js API routes
- ✅ Updated authentication to work with Next.js middleware
- ✅ Simplified deployment to single application
- ✅ Improved type safety with TypeScript throughout

### What Stayed the Same:
- ✅ All existing functionality preserved
- ✅ Same database models and structure
- ✅ WhatsApp notification service
- ✅ Same AI chatbot functionality
- ✅ Same admin panel features

## 📝 License

This project is private and proprietary.

## 🤝 Support

For support, contact your admin or create an issue in the repository.

## 🔧 Development Notes

### Database Connection
The application uses MongoDB with connection pooling optimized for serverless environments. The connection is cached globally to prevent multiple connections in development.

### Authentication
JWT tokens are used for admin authentication. The authentication middleware checks for valid tokens on protected API routes.

### WhatsApp Service
The WhatsApp service sends instant notifications to the admin number for all form submissions and applications.

### AI Chatbot
The chatbot uses Google Gemini AI with a custom knowledge base stored in MongoDB. Admins can manage the knowledge base through the admin panel.