# Appwrite Permissions Fix

## Issue
Collection returns 401 "not authorized" when querying documents.

## Root Cause
According to Appwrite docs (https://appwrite.io/docs/products/databases/permissions):
- Collections need document-level security enabled
- Documents need explicit permissions set for users
- Client SDK can only access documents they have permission for

## Solution

### Step 1: Enable Document Security on Collection
The collection must have `documentSecurity: true` to use document-level permissions.

### Step 2: Set Permissions When Creating Documents
Each document needs explicit permissions for the user:
```typescript
const permissions = [
  `read("user(${userId})")`,
  `update("user(${userId})")`,
  `delete("user(${userId})")`,
];
```

### Step 3: Query Only User's Documents
Filter by userId to ensure users only see their own items:
```typescript
Query.equal('userId', userId)
```

## Implementation Status

✅ Collection created with `documentSecurity: true`
✅ Documents created with user-specific permissions
✅ Queries filtered by userId
✅ Error handling for unauthorized access

## Testing

1. Sign up with a new account
2. You should see an empty closet (no items yet)
3. Add a new item - it will be created with your permissions
4. You should be able to see, edit, and delete your items
5. Other users cannot see your items

## References
- Appwrite Permissions: https://appwrite.io/docs/products/databases/permissions
- Document Security: https://appwrite.io/docs/products/databases/document-security
- Client SDK Auth: https://appwrite.io/docs/products/auth/sessions
