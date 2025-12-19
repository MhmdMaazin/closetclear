# Authentication Setup Guide

## Overview

Your ClosetClear app uses Appwrite's built-in authentication system. This guide covers:
- Enabling authentication methods
- Configuring OAuth providers (optional)
- Setting up email verification
- Implementing session management

## Step 1: Enable Email/Password Authentication

1. Go to https://cloud.appwrite.io/console
2. Select your project
3. Navigate to **Auth** → **Settings**
4. Under "Email/Password", ensure it's **Enabled**
5. Configure password requirements:
   - Minimum length: 8 characters (recommended)
   - Allow user registration: **Enabled**

## Step 2: Configure Email Verification (Optional)

For production, enable email verification:

1. In **Auth** → **Settings**
2. Find "Email Verification"
3. Enable it and set the verification URL to your app domain
4. Users will receive a verification email after signup

## Step 3: Session Management

Your app automatically handles sessions:
- Sessions are stored in browser localStorage
- Sessions expire after 30 days (configurable)
- Users stay logged in across page refreshes

## Step 4: OAuth Providers (Optional)

To add social login (Google, GitHub, etc.):

1. In **Auth** → **Settings** → **OAuth2 Providers**
2. Select a provider (e.g., Google)
3. Follow the provider's setup instructions
4. Add the OAuth credentials to Appwrite
5. Update your app to use OAuth login

## Security Best Practices

### 1. Password Requirements
- Minimum 8 characters
- Mix of uppercase, lowercase, numbers, and symbols (recommended)
- Never store passwords in localStorage

### 2. Session Security
- Sessions are HTTP-only cookies (when possible)
- Always use HTTPS in production
- Implement logout on sensitive operations

### 3. User Data Protection
- Use Row-Level Security (RLS) on collections
- Filter queries by userId to prevent data leaks
- Never expose sensitive data in client-side code

### 4. Rate Limiting
- Appwrite has built-in rate limiting
- Configure in **Settings** → **Rate Limiting**
- Recommended: 100 requests per minute per IP

## Implementation in Your App

### Current Auth Flow

1. **Signup**: User creates account with email/password/name
   ```typescript
   await signup(email, password, name);
   ```

2. **Login**: User logs in with email/password
   ```typescript
   await login(email, password);
   ```

3. **Session Check**: App checks if user is logged in
   ```typescript
   const user = await getCurrentUser();
   ```

4. **Logout**: User logs out
   ```typescript
   await logout();
   ```

### Enhanced Auth Service

The `services/appwrite.ts` file includes:
- `getCurrentUser()` - Get current logged-in user
- `login(email, password)` - Login with credentials
- `signup(email, password, name)` - Create new account
- `logout()` - Logout current user

### Auth Component

The `components/Auth.tsx` component provides:
- Login form with email/password
- Signup form with name/email/password
- Error handling and loading states
- Toggle between login and signup modes

## Testing Authentication

### Test Signup
1. Click "Join now" on the login page
2. Enter name, email, and password (min 8 chars)
3. Click "Create Account"
4. You should be logged in automatically

### Test Login
1. Enter your email and password
2. Click "Sign In"
3. You should be logged in

### Test Session Persistence
1. Log in to your account
2. Refresh the page
3. You should still be logged in

### Test Logout
1. Click the logout button (in Dashboard/Navbar)
2. You should be redirected to the login page

## Troubleshooting

### "Invalid credentials" error
- Verify email and password are correct
- Check that the account exists
- Ensure password is at least 8 characters

### "User already exists" error
- The email is already registered
- Try logging in instead
- Use a different email for signup

### Session not persisting
- Check browser localStorage is enabled
- Verify cookies are not blocked
- Check browser console for errors

### Email verification not working
- Verify email is configured in Appwrite settings
- Check spam folder for verification email
- Ensure verification URL is correct

## Next Steps

1. Test the authentication flow in your app
2. Customize the Auth component styling if needed
3. Add password reset functionality (optional)
4. Implement OAuth providers for social login (optional)
5. Set up email verification for production

## Useful Appwrite Auth Links

- **Auth Settings**: https://cloud.appwrite.io/console/settings/auth
- **Users**: https://cloud.appwrite.io/console/users
- **Sessions**: https://cloud.appwrite.io/console/users (view user sessions)
- **Auth Documentation**: https://appwrite.io/docs/products/auth
