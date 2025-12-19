
import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';
import { ClothingItem } from '../types';

const endpoint = (import.meta as any).env.VITE_REACT_APP_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const projectId = (import.meta as any).env.VITE_REACT_APP_APPWRITE_PROJECT_ID || '6944f07400062fbe93ac';

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

const DB_ID = (import.meta as any).env.VITE_REACT_APP_APPWRITE_DATABASE_ID || '6944f10c002d9a532214';
const COLLECTION_ID = (import.meta as any).env.VITE_REACT_APP_APPWRITE_COLLECTION_ID || 'clothing_items';
const BUCKET_ID = (import.meta as any).env.VITE_REACT_APP_APPWRITE_BUCKET_ID || 'closet_images';

// Auth Helpers
export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    return null;
  }
};

export const login = async (email: string, password: string) => {
  try {
    // Delete any existing sessions first
    try {
      await account.deleteSession('current');
    } catch (e) {
      // No existing session, continue
    }
    
    const session = await (account as any).createEmailPasswordSession(email, password);
    return session;
  } catch (error: any) {
    if (error.code === 401) {
      throw new Error('Invalid email or password');
    }
    throw new Error(error.message || 'Login failed');
  }
};

export const signup = async (email: string, password: string, name: string) => {
  try {
    // Validate inputs
    if (!email || !password || !name) {
      throw new Error('All fields are required');
    }
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
    
    // Create user account
    const user = await account.create(ID.unique(), email, password, name);
    
    // Automatically log them in
    const session = await login(email, password);
    return { user, session };
  } catch (error: any) {
    if (error.code === 409) {
      throw new Error('Email already registered. Please login instead.');
    }
    throw new Error(error.message || 'Signup failed');
  }
};

export const logout = async () => {
  try {
    await account.deleteSession('current');
  } catch (error: any) {
    throw new Error(error.message || 'Logout failed');
  }
};

export const updateUserProfile = async (name: string) => {
  try {
    return await account.updateName(name);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update profile');
  }
};

export const updateUserEmail = async (email: string, password: string) => {
  try {
    return await account.updateEmail(email, password);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update email');
  }
};

export const updateUserPassword = async (password: string, oldPassword: string) => {
  try {
    return await account.updatePassword(password, oldPassword);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update password');
  }
};

// Database Helpers
export const getItems = async (userId: string) => {
  try {
    // Filter items by userId to ensure users only see their own closet
    const response = await databases.listDocuments(
      DB_ID,
      COLLECTION_ID,
      [Query.equal('userId', userId), Query.limit(100)]
    );
    
    return response.documents.map(doc => ({
      ...doc,
      id: doc.$id, // Map Appwrite $id to our internal id
    })) as unknown as ClothingItem[];
  } catch (error: any) {
    // Silently return empty array - user may not have items yet or permissions not set
    // This is expected behavior with document-level security
    return [];
  }
};

export const addItem = async (item: Omit<ClothingItem, 'id'>, userId: string, file?: File) => {
  let imageUrl = item.imageUrl;

  // Upload image if file exists
  if (file) {
    try {
      const upload = await storage.createFile(BUCKET_ID, ID.unique(), file);
      // Construct view URL
      imageUrl = `${endpoint}/storage/buckets/${BUCKET_ID}/files/${upload.$id}/view?project=${projectId}`;
    } catch (e) {
      console.error("Image upload failed", e);
    }
  }

  const payload = {
    ...item,
    imageUrl, // Use the new URL or the base64 fallback
    userId,
    resaleValue: Number(item.resaleValue),
    wearCount: Number(item.wearCount),
    tags: item.tags // Appwrite supports array attributes
  };

  const response = await databases.createDocument(
    DB_ID,
    COLLECTION_ID,
    ID.unique(),
    payload
  );

  return { ...response, id: response.$id } as unknown as ClothingItem;
};

export const updateItem = async (item: ClothingItem) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, $id, $databaseId, $collectionId, $createdAt, $updatedAt, $permissions, ...payload } = item as any;
  
  await databases.updateDocument(
    DB_ID,
    COLLECTION_ID,
    item.id,
    payload
  );
};

export const deleteItem = async (itemId: string) => {
  await databases.deleteDocument(DB_ID, COLLECTION_ID, itemId);
};

// Chat History Functions
const CHAT_COLLECTION_ID = 'stylist_chat_history';

export const saveChatMessage = async (userId: string, role: 'user' | 'model', text: string, sessionId?: string) => {
  try {
    const response = await databases.createDocument(
      DB_ID,
      CHAT_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        role,
        text,
        timestamp: new Date().toISOString(),
        sessionId: sessionId || `session_${Date.now()}`,
      }
    );
    return response;
  } catch (error: any) {
    console.error("Error saving chat message:", error);
    throw error;
  }
};

export const getChatHistory = async (userId: string, sessionId?: string) => {
  try {
    const queries = [Query.equal('userId', userId)];
    if (sessionId) {
      queries.push(Query.equal('sessionId', sessionId));
    }
    queries.push(Query.orderAsc('timestamp'));
    queries.push(Query.limit(100));

    const response = await databases.listDocuments(
      DB_ID,
      CHAT_COLLECTION_ID,
      queries
    );

    return response.documents.map(doc => ({
      id: doc.$id,
      role: doc.role,
      text: doc.text,
      timestamp: doc.timestamp,
      sessionId: doc.sessionId,
    }));
  } catch (error: any) {
    console.error("Error fetching chat history:", error);
    return [];
  }
};

export const deleteChatHistory = async (sessionId: string) => {
  try {
    const messages = await databases.listDocuments(
      DB_ID,
      CHAT_COLLECTION_ID,
      [Query.equal('sessionId', sessionId)]
    );

    for (const msg of messages.documents) {
      await databases.deleteDocument(DB_ID, CHAT_COLLECTION_ID, msg.$id);
    }
  } catch (error: any) {
    console.error("Error deleting chat history:", error);
    throw error;
  }
};
