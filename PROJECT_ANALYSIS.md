# ClosetClear AI - Complete Project Analysis

## Project Overview
ClosetClear AI is a digital wardrobe management app that uses AI to analyze clothing items, suggest outfits, and help users manage their closet inventory.

## Technology Stack
- **Frontend**: React 18.2.0 + TypeScript
- **Styling**: Tailwind CSS (CDN)
- **Backend**: Appwrite (BaaS)
- **AI**: Google Gemini 2.5 Flash
- **Build Tool**: Vite
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

## Database Schema

### Collection: `clothing_items`

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| userId | String | Yes | Links item to user |
| name | String | Yes | Item name (e.g., "Navy Blue Wool Blazer") |
| category | String | Yes | Category enum (Tops, Bottoms, Outerwear, Shoes, Accessories, Dresses) |
| color | String | No | Dominant color |
| size | String | No | Clothing size |
| brand | String | No | Brand name |
| condition | String | No | Item condition |
| season | String | No | Season enum (Summer, Winter, Spring/Fall, All Season) |
| purchaseDate | String | No | ISO date format |
| purchasePrice | Float | No | Original purchase price |
| resaleValue | Float | No | Current resale value (USD) |
| wearCount | Integer | No | Number of times worn |
| lastWorn | String | No | ISO date of last wear |
| imageUrl | String | No | Image URL or base64 |
| tags | String[] | No | Array of custom tags |
| notes | String | No | Additional notes |

### Storage Bucket: `closet_images`
- Allowed formats: JPEG, PNG, WebP, GIF
- Max file size: 10MB
- User-based access control

## Core Features

### 1. Authentication (`components/Auth.tsx`)
- Email/password signup and login
- Session persistence
- Error handling
- Form validation (password min 8 chars)

### 2. Dashboard (`components/Dashboard.tsx`)
**Displays:**
- Total items count
- Total wardrobe value
- Utilization rate (% of items worn 3+ times)
- Top 5 most-worn items chart
- Recommendations (item to sell, item to wear)

**Data Used:**
- `resaleValue` - for total value calculation
- `wearCount` - for utilization rate and charts
- `name`, `category` - for display

### 3. Closet Gallery (`components/ClosetGallery.tsx`)
**Features:**
- Grid view of all items
- Item details modal
- Edit item functionality
- Delete item functionality
- CSV export
- Mark as worn (increments wearCount, updates lastWorn)

**Data Used:**
- All fields for display and editing
- `wearCount`, `lastWorn` - for wear tracking
- `imageUrl` - for thumbnails

### 4. Item Scanner (`components/ItemScanner.tsx`)
**Features:**
- Upload image
- AI analysis via Gemini
- Auto-populate item details
- Save to closet

**Data Flow:**
1. User uploads image
2. Gemini analyzes and returns: name, category, color, brand, season, resaleValue, tags
3. App adds: userId, wearCount (0), lastWorn (today), imageUrl
4. Saves to database

### 5. Stylist AI (`components/StylistAI.tsx`)
**Features:**
- Chat interface with fashion AI
- Context-aware suggestions
- Conversation history
- Uses closet inventory for recommendations

**Data Used:**
- All item fields for context
- Conversation history for context

### 6. Trips/Packing (`components/Trips.tsx`)
**Features:**
- Plan trips
- Generate packing lists
- AI suggests items based on destination/duration/type

**Data Used:**
- All item fields for selection
- Weather inference for destination

## API Integrations

### Appwrite
- **Auth**: Email/password sessions
- **Database**: CRUD operations on clothing_items
- **Storage**: Image uploads to closet_images bucket

### Google Gemini
- **Image Analysis**: Analyzes clothing photos
- **Stylist Chat**: Conversational fashion advice
- **Packing Lists**: Trip-based recommendations
- **Resale Listings**: Creates marketplace listings

## Data Flow

### Adding an Item
```
User uploads image
    ↓
Gemini analyzes image
    ↓
Returns: name, category, color, brand, season, resaleValue, tags
    ↓
App adds: userId, wearCount=0, lastWorn=today, imageUrl
    ↓
Saves to Appwrite database
    ↓
Item appears in closet gallery
```

### Marking Item as Worn
```
User clicks "Mark as Worn"
    ↓
wearCount increments by 1
    ↓
lastWorn updates to today
    ↓
Updates in database
    ↓
Dashboard stats recalculate
```

### Getting Recommendations
```
Dashboard loads
    ↓
Filters items with wearCount < 3 and resaleValue >= $25
    ↓
Suggests highest value item to sell
    ↓
Filters items with wearCount < 5
    ↓
Randomly suggests item to wear
```

## Environment Variables

```
VITE_GEMINI_API_KEY=<your_gemini_key>
VITE_REACT_APP_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_REACT_APP_APPWRITE_PROJECT_ID=6944f07400062fbe93ac
VITE_REACT_APP_APPWRITE_DATABASE_ID=6944f10c002d9a532214
VITE_REACT_APP_APPWRITE_COLLECTION_ID=clothing_items
VITE_REACT_APP_APPWRITE_BUCKET_ID=closet_images
APPWRITE_API_KEY=<server_api_key_for_setup_only>
```

## Key Data Fields Summary

### Required Fields (must be provided)
- `userId` - from authenticated user
- `name` - from Gemini or user input
- `category` - from Gemini or user selection
- `imageUrl` - from upload or Gemini

### Auto-Generated Fields
- `id` - Appwrite $id
- `wearCount` - starts at 0
- `lastWorn` - set to today on creation

### Optional Fields (from Gemini or user)
- `color`, `brand`, `season`, `resaleValue`, `tags`
- `size`, `condition`, `purchaseDate`, `purchasePrice`, `notes`

## Permissions & Security

- Users can only access their own items (filtered by userId)
- Collection has user-level read/create/update/delete permissions
- Storage bucket has user-level permissions
- Sessions persist across page refreshes
- API keys stored in environment variables

## Common Issues & Solutions

### "Unknown attribute" errors
- Add missing field to database schema
- Run `npm run setup:appwrite` to create attribute
- Restart dev server

### 401 Unauthorized errors
- Set collection and bucket permissions in Appwrite console
- Ensure user is logged in
- Check session is valid

### Image upload failures
- Verify bucket permissions are set
- Check file size < 10MB
- Ensure file type is JPEG, PNG, WebP, or GIF

### Gemini API errors
- Verify API key is correct
- Check API key has required scopes
- Service may be overloaded (503 errors are temporary)

## Next Steps for Production

1. ✅ Database configured
2. ✅ Authentication working
3. ✅ All data fields added
4. ⚠️ Set collection/bucket permissions in Appwrite console
5. 🔄 Test all features end-to-end
6. 📦 Build for production: `npm run build`
7. 🚀 Deploy to hosting (Vercel, Netlify, etc.)
