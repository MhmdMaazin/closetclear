# Chat History Setup Guide

The chat history feature requires a separate collection in Appwrite. Follow these steps to set it up manually:

## Step 1: Create the Collection

1. Go to https://cloud.appwrite.io/console
2. Select your project
3. Go to **Databases** → **ClosetClear**
4. Click **Create Collection**
5. Fill in:
   - **Collection ID**: `stylist_chat_history`
   - **Collection Name**: `Stylist Chat History`
   - **Document Security**: OFF (unchecked)
6. Click **Create**

## Step 2: Set Collection Permissions

1. Click on the collection you just created
2. Go to **Settings** tab
3. Scroll to **Permissions**
4. Click **Add Permission**
5. Select:
   - **Role**: User
   - **Permissions**: read, create, update, delete
6. Click **Add**
7. Save

## Step 3: Create Attributes

In the collection, create these attributes:

### 1. userId (String)
- **Key**: `userId`
- **Type**: String
- **Size**: 255
- **Required**: Yes

### 2. role (String)
- **Key**: `role`
- **Type**: String
- **Size**: 50
- **Required**: Yes

### 3. text (String)
- **Key**: `text`
- **Type**: String
- **Size**: 5000
- **Required**: Yes

### 4. timestamp (String)
- **Key**: `timestamp`
- **Type**: String
- **Size**: 50
- **Required**: Yes

### 5. sessionId (String)
- **Key**: `sessionId`
- **Type**: String
- **Size**: 255
- **Required**: No

## Step 4: Enable Chat History in Code

Once the collection is created, uncomment the chat history code in `components/StylistAI.tsx`:

1. Uncomment the `getChatHistory` call in the `useEffect`
2. Uncomment the `saveChatMessage` calls in the `handleSend` function

## What Chat History Does

- **Saves every message** (user and AI) to the database
- **Loads previous conversations** when you return to the Stylist AI page
- **Organizes by session** - each conversation has a unique session ID
- **Includes timestamps** - track when each message was sent
- **Allows clearing history** - button in the header to clear current session

## Data Structure

Each chat message is stored with:
- `userId` - which user the chat belongs to
- `role` - 'user' or 'model'
- `text` - the message content
- `timestamp` - ISO timestamp when sent
- `sessionId` - groups messages by conversation session

## Troubleshooting

### Collection not found error
- Verify the collection ID is exactly `stylist_chat_history`
- Check that permissions are set to allow users to read/create/update/delete
- Refresh the browser after creating the collection

### Attributes not found
- Make sure all 5 attributes are created
- Check attribute names match exactly (case-sensitive)
- Verify attribute types are correct

### Chat not saving
- Check browser console for errors
- Verify user is logged in
- Ensure collection permissions are set correctly
