# Manual Permissions Fix for Appwrite

The collection and bucket permissions need to be set manually in the Appwrite console. Follow these steps:

## Step 1: Fix Collection Permissions

1. Go to https://cloud.appwrite.io/console
2. Select your project
3. Go to **Databases** → **ClosetClear** → **clothing_items** collection
4. Click the **Settings** tab
5. Scroll to **Permissions**
6. Click **Add Permission**
7. Select:
   - **Role**: User
   - **Permission**: read, create, update, delete
8. Click **Add**
9. Save changes

## Step 2: Fix Storage Bucket Permissions

1. Go to **Storage** → **closet_images** bucket
2. Click the **Settings** tab
3. Scroll to **Permissions**
4. Click **Add Permission**
5. Select:
   - **Role**: User
   - **Permission**: read, create, update, delete
6. Click **Add**
7. Save changes

## Step 3: Test

1. Refresh your browser
2. Try logging in
3. Try adding an item with an image
4. Check browser console - should see no 401 errors

## Why This Happened

The REST API permissions format is different from the SDK format. The manual console approach is more reliable for setting up permissions correctly.

## References

- Appwrite Permissions: https://appwrite.io/docs/products/databases/permissions
- Storage Permissions: https://appwrite.io/docs/products/storage/permissions
