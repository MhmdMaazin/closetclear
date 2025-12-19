# ClosetClear AI

A modern, AI-powered digital wardrobe management system that helps you organize your closet, get personalized outfit recommendations, and monetize unworn clothing.

## 🎯 Overview

ClosetClear AI transforms how you interact with your wardrobe by:
- **Digitizing your closet** with AI-powered image recognition
- **Suggesting daily outfits** based on your schedule and style
- **Tracking wear patterns** to identify underutilized items
- **Estimating resale value** for items you want to sell
- **Planning trips** with smart packing lists
- **Providing AI styling advice** through an interactive chatbot

## 🚀 Features

### 1. **Dashboard**
- Real-time closet analytics and statistics
- Total items count and estimated resale value
- Underutilized items tracking (worn < 3 times)
- Circular score based on wear frequency and resale potential
- Most worn vs. resale value visualization
- Smart suggestions for selling or wearing more

### 2. **Closet Gallery**
- Browse all items with filtering by category
- Search by name or brand
- Edit item details (name, category, brand, color, season, resale value, tags)
- Track wear count and last worn date
- Delete items with confirmation dialog
- Responsive grid layout for mobile and desktop

### 3. **Item Scanner**
- Upload clothing photos
- AI-powered image analysis to extract:
  - Item name and description
  - Category (Shirt, Pants, Dress, etc.)
  - Color and brand
  - Season suitability
  - Estimated resale value
  - Relevant tags
- Real-time preview and editing before saving
- Automatic image upload to cloud storage

### 4. **AI Stylist**
- Interactive chat with AI fashion advisor
- Context-aware suggestions based on your closet
- Chat history persistence across sessions
- Clear chat history with confirmation
- Suggestions for outfit planning and styling tips
- Conversation history saved to database

### 5. **Trips Planner**
- Plan packing lists for upcoming trips
- Input destination, duration, and trip type
- AI generates smart packing recommendations
- Weather-aware suggestions
- Outfit coordination tips

### 6. **Authentication**
- Email/password signup and login
- Secure session management
- Profile management (name, email, password)
- Automatic session persistence

### 7. **Notifications**
- Toast notifications for success, error, and info messages
- Auto-dismiss after 3 seconds
- Manual close button
- Smooth animations

### 8. **Confirmation Dialogs**
- Professional confirmation for destructive actions
- Delete item confirmation
- Clear chat history confirmation
- Danger mode styling for critical actions

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling (via CDN)
- **Vite** - Build tool and dev server
- **Lucide React** - Icon library
- **Framer Motion** - Animations
- **Recharts** - Data visualization

### Backend & Services
- **Appwrite 14.0.0** - Backend-as-a-Service
  - Authentication
  - Database (Collections)
  - File Storage
- **Google Gemini 2.5 Flash** - AI services
  - Image analysis
  - Styling advice
  - Packing list generation
  - Resale listing generation

### Development
- **Node.js** - Runtime
- **npm** - Package manager

## 📦 Project Structure

```
closetclear-ai/
├── components/              # React components
│   ├── Auth.tsx            # Authentication UI
│   ├── Dashboard.tsx        # Main dashboard
│   ├── ClosetGallery.tsx   # Closet browsing & editing
│   ├── ItemScanner.tsx     # Image upload & analysis
│   ├── StylistAI.tsx       # AI chat interface
│   ├── Trips.tsx           # Trip planning
│   ├── LandingPage.tsx     # Landing page
│   ├── Navbar.tsx          # Navigation
│   ├── Toast.tsx           # Toast notifications
│   ├── ConfirmDialog.tsx   # Confirmation dialogs
│   └── StatsCard.tsx       # Reusable stats card
├── services/               # API & external services
│   ├── appwrite.ts         # Appwrite client & functions
│   └── geminiService.ts    # Google Gemini AI functions
├── hooks/                  # Custom React hooks
│   └── useToast.ts         # Toast management hook
├── context/                # React context
│   └── ToastContext.tsx    # Toast context provider
├── scripts/                # Setup & utility scripts
│   ├── setupAppwrite.js    # Database initialization
│   ├── setupChatHistory.js # Chat collection setup
│   └── testAuth.js         # Authentication testing
├── types.ts                # TypeScript type definitions
├── constants.ts            # App constants
├── App.tsx                 # Main app component
├── index.tsx               # React entry point
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies
└── .env.local              # Environment variables
```

## 🗄️ Database Schema

### Collections

#### `clothing_items`
Main collection for storing wardrobe items.

**Attributes:**
- `userId` (String) - Owner of the item
- `name` (String) - Item name/description
- `category` (String) - Category (Shirt, Pants, Dress, etc.)
- `color` (String) - Dominant color
- `brand` (String) - Brand name
- `condition` (String) - Item condition
- `season` (String) - Best season (Spring, Summer, Fall, Winter)
- `purchaseDate` (String) - Purchase date (ISO format)
- `purchasePrice` (Number) - Original purchase price
- `resaleValue` (Number) - Estimated resale value
- `wearCount` (Number) - Times worn
- `lastWorn` (String) - Last worn date (ISO format)
- `imageUrl` (String) - Image URL
- `tags` (Array) - Descriptive tags
- `notes` (String) - Additional notes

**Indexes:**
- `userId` - For filtering by user
- `category` - For filtering by category
- `userId + category` - For combined filtering

#### `stylist_chat_history`
Stores AI stylist chat messages.

**Attributes:**
- `userId` (String) - User who sent the message
- `role` (String) - 'user' or 'model'
- `text` (String) - Message content
- `timestamp` (String) - ISO timestamp
- `sessionId` (String) - Session identifier

### Storage

#### `closet_images`
Bucket for storing clothing item images.

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Gemini AI API
VITE_GEMINI_API_KEY=your_gemini_api_key

# Appwrite Configuration
VITE_REACT_APP_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_REACT_APP_APPWRITE_PROJECT_ID=your_project_id
VITE_REACT_APP_APPWRITE_DATABASE_ID=your_database_id
VITE_REACT_APP_APPWRITE_COLLECTION_ID=clothing_items
VITE_REACT_APP_APPWRITE_BUCKET_ID=closet_images

# Server-side API Key (for scripts only)
APPWRITE_API_KEY=your_api_key
```

**Note:** Variables prefixed with `VITE_` are exposed to the browser. Never expose sensitive keys this way in production.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Appwrite account and project
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd closetclear-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Initialize Appwrite database**
   ```bash
   npm run setup:appwrite
   ```

5. **Set up chat history collection**
   ```bash
   npm run setup:chat-history
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start Vite dev server

# Build
npm run build            # Build for production
npm run preview          # Preview production build

# Setup
npm run setup:appwrite   # Initialize Appwrite database
npm run setup:chat-history # Create chat history collection
npm run test:auth        # Test authentication

# Linting
npm run lint             # Run ESLint
```

## 🔑 Key Components

### Authentication Flow
1. User lands on landing page
2. Clicks "Get Started" or "Log In"
3. Enters email, password, and name (for signup)
4. System creates Appwrite user account
5. Automatic login after signup
6. Session persists across page refreshes

### Item Upload Flow
1. User navigates to "Add Item"
2. Uploads clothing photo
3. AI analyzes image and extracts details
4. User reviews and edits details
5. Item saved to database with image upload
6. Item appears in closet gallery

### AI Styling Flow
1. User opens "AI Stylist"
2. Chat history loads from database
3. User types question or request
4. AI analyzes closet context and responds
5. Messages saved to database
6. Chat persists across sessions

## 🎨 Design System

### Colors
- **Primary:** Indigo-600 (#4F46E5)
- **Success:** Emerald-500 (#10B981)
- **Danger:** Red-600 (#DC2626)
- **Background:** Slate-50 (#F8FAFC)
- **Text:** Slate-900 (#0F172A)

### Typography
- **Serif Font:** Playfair Display (headings)
- **Sans Font:** Inter (body text)

### Components
- **Cards:** Rounded-2xl with subtle shadows
- **Buttons:** Rounded-lg with hover effects
- **Inputs:** Rounded-2xl with focus rings
- **Modals:** Backdrop blur with animations

## 🔒 Security Considerations

1. **Environment Variables:** Never commit `.env.local` to version control
2. **API Keys:** Keep Gemini API key and Appwrite keys secure
3. **User Data:** All user data is scoped to their user ID
4. **Permissions:** Appwrite permissions restrict data access
5. **Session Management:** Sessions are managed by Appwrite

## 🐛 Troubleshooting

### Common Issues

**"Collection not found" error**
- Verify collection IDs in `.env.local`
- Run `npm run setup:appwrite` to create collections
- Check Appwrite console for collection existence

**"Unknown attribute" error**
- Run `npm run setup:appwrite` to create attributes
- Verify attribute names match exactly (case-sensitive)

**Images not uploading**
- Check bucket ID in `.env.local`
- Verify bucket permissions in Appwrite console
- Ensure file size is within limits

**Chat history not saving**
- Run `npm run setup:chat-history` to create collection
- Verify user is logged in
- Check browser console for errors

**AI responses not generating**
- Verify Gemini API key is valid
- Check API quota and billing
- Ensure closet items are properly formatted

## 📱 Responsive Design

The app is fully responsive with:
- **Mobile:** Bottom navigation bar, optimized layouts
- **Tablet:** Adjusted spacing and grid columns
- **Desktop:** Side navigation, full-width layouts

## 🚀 Performance Optimizations

- Lazy loading of components
- Optimistic UI updates
- LocalStorage caching for chat messages
- Image optimization and CDN delivery
- Efficient database queries with indexes

## 🔄 Data Flow

```
User Input
    ↓
Component State
    ↓
Appwrite Service
    ↓
Appwrite Backend
    ↓
Database/Storage
    ↓
Response
    ↓
UI Update + Toast Notification
```

## 📚 API Integration

### Appwrite
- Authentication: Email/password sessions
- Database: CRUD operations on collections
- Storage: File uploads and retrieval
- Queries: Filtering and sorting with Query API

### Google Gemini
- Image Analysis: Extract clothing details from photos
- Text Generation: Styling advice and recommendations
- JSON Responses: Structured data for packing lists and listings

## 🎓 Learning Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Google Gemini API](https://ai.google.dev/)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 📄 License

This project is proprietary and confidential.

## 👥 Support

For issues or questions:
1. Check the troubleshooting section
2. Review setup documentation files
3. Check browser console for error messages
4. Verify environment variables are set correctly

## 🎉 Features Coming Soon

- Social sharing of closet snapshots
- Outfit history and favorites
- Integration with resale marketplaces
- Advanced analytics and insights
- Mobile app (React Native)
- Wishlist and shopping recommendations
- Sustainability tracking
- Wardrobe color palette analysis

---

**Version:** 1.0.0  
**Last Updated:** December 2025  
**Status:** Active Development
#   c l o s e t c l e a r  
 