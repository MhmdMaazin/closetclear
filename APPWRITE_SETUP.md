# Appwrite Database Setup Guide

## Prerequisites

1. **Appwrite Account**: Create one at https://cloud.appwrite.io
2. **API Key**: Generate a server-side API key from your Appwrite console
3. **Environment Variables**: Already partially configured in `.env.local`

## Step-by-Step Setup

### 1. Get Your API Key

1. Go to https://cloud.appwrite.io/console
2. Select your project
3. Navigate to **Settings** → **API Keys**
4. Click **Create API Key**
5. Give it a name (e.g., "Setup Script")
6. Select these scopes:
   - `databases.read`
   - `databases.write`
   - `collections.read`
   - `collections.write`
   - `attributes.read`
   - `attributes.write`
   - `indexes.read`
   - `indexes.write`
   - `buckets.read`
   - `buckets.write`
   - `files.read`
   - `files.write`
7. Copy the API key

### 2. Update Environment Variables

Add to your `.env.local`:

```
APPWRITE_API_KEY=your_api_key_here
```

Your `.env.local` should now have:
```
GEMINI_API_KEY=PLACEHOLDER_API_KEY
REACT_APP_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
REACT_APP_APPWRITE_PROJECT_ID=6944f07400062fbe93ac
REACT_APP_APPWRITE_DATABASE_ID=6944f10c002d9a532214
APPWRITE_API_KEY=your_api_key_here
```

### 3. Run the Setup Script

```bash
# Install ts-node if you haven't already
npm install --save-dev ts-node

# Run the setup script
npx ts-node scripts/setupAppwrite.ts
```

The script will:
- ✅ Create the database (if not exists)
- ✅ Create the `clothing_items` collection
- ✅ Create all required attributes (userId, name, category, color, etc.)
- ✅ Create indexes for better query performance
- ✅ Create the `closet_images` storage bucket

### 4. Update .env.local with Collection & Bucket IDs

After running the script, update your `.env.local`:

```
REACT_APP_APPWRITE_COLLECTION_ID=clothing_items
REACT_APP_APPWRITE_BUCKET_ID=closet_images
```

## Database Schema

### Collection: `clothing_items`

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| userId | String | Yes | User ID from auth |
| name | String | Yes | Item name |
| category | String | Yes | e.g., "shirt", "pants", "dress" |
| color | String | No | Item color |
| size | String | No | Clothing size |
| brand | String | No | Brand name |
| condition | String | No | e.g., "new", "like-new", "good", "fair" |
| purchaseDate | String | No | ISO date format |
| purchasePrice | Float | No | Original purchase price |
| resaleValue | Float | No | Current resale value |
| wearCount | Integer | No | Number of times worn |
| imageUrl | String | No | URL to item image |
| tags | String[] | No | Array of tags |
| notes | String | No | Additional notes |

### Storage Bucket: `closet_images`

- Allowed file types: JPEG, PNG, WebP, GIF
- Max file size: 10MB (default)
- Permissions: User-based access control

## Security & Permissions

The setup script configures:

- **Collection Permissions**: Users can only read/write/update/delete their own documents (enforced via userId field)
- **Bucket Permissions**: Users can upload, view, and delete their own images
- **Row-Level Security**: Implement in your app by filtering queries with `Query.equal('userId', userId)`

## Troubleshooting

### "APPWRITE_API_KEY is required"
- Make sure you've added the API key to `.env.local`
- Restart your development server after updating `.env.local`

### "Collection already exists" error
- This is normal if you've run the script before
- The script will skip existing resources

### Permission Denied errors
- Verify your API key has the required scopes
- Check that the API key is for a server-side context (not client-side)

### Images not uploading
- Verify the bucket ID is correct in `.env.local`
- Check file size (max 10MB by default)
- Ensure file type is in the allowed list (JPEG, PNG, WebP, GIF)

## Next Steps

1. Update your `services/appwrite.ts` to use the new collection and bucket IDs
2. Test the app by creating a user account and adding clothing items
3. Verify images upload correctly to the storage bucket
4. Monitor Appwrite console for any errors

## Useful Appwrite Console Links

- **Database**: https://cloud.appwrite.io/console/databases
- **Collections**: https://cloud.appwrite.io/console/databases/[DB_ID]/collections
- **Storage**: https://cloud.appwrite.io/console/storage
- **API Keys**: https://cloud.appwrite.io/console/settings/api-keys
