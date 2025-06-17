# Environment Setup Guide

This guide explains how to set up the required environment variables for the Napricot Social application.

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Base URLs
BASE_URL=https://dev.napricot.com:3000
OPERATION_URL=https://api.napricot.com

# Facebook Configuration
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_CONFIG_ID=your_facebook_config_id_here

# Google OAuth Configuration for YouTube
GOOGLE_CLIENT_ID=your_google_client_id_here

# Nuxt Configuration
NUXT_PORT=3000
```

## Setting up Google OAuth for YouTube

1. **Create a Google Cloud Project:**

   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable YouTube Data API:**

   - Navigate to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click on it and enable the API

3. **Create OAuth 2.0 Credentials:**

   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application" as the application type
   - Add your domain to "Authorized JavaScript origins" (e.g., `https://dev.napricot.com:3000`)
   - **Important**: Do NOT add redirect URIs for Google Identity Services - they are not needed

4. **Configure OAuth Consent Screen:**

   - Go to "APIs & Services" > "OAuth consent screen"
   - Fill in the required information
   - Add the required scopes:
     - `../auth/userinfo.email`
     - `../auth/userinfo.profile`
     - `../auth/youtube.readonly`
     - `../auth/youtube.upload`

5. **Copy Credentials:**
   - Copy the Client ID only (Client Secret is not needed for frontend OAuth with GIS)
   - Add the Client ID to your `.env` file

## Setting up Facebook Login

1. **Create a Facebook App:**

   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app or use an existing one

2. **Configure Facebook Login:**

   - Add "Facebook Login" product to your app
   - Configure the OAuth redirect URIs
   - Set up the app domains

3. **Copy Credentials:**
   - Copy the App ID and Config ID
   - Add them to your `.env` file

## Notes

- Make sure your `.env` file is added to `.gitignore` to keep credentials secure
- Update the domains and redirect URIs to match your deployment environment
- For development, you might need to add `localhost` or your development domain to the authorized origins
- **Migration Note**: This implementation uses the new Google Identity Services (GIS) library, not the deprecated `gapi.auth2` library

## Available Scopes

### YouTube (Google OAuth)

- `profile` - Basic profile information
- `email` - Email address
- `https://www.googleapis.com/auth/youtube.readonly` - Read-only access to YouTube account
- `https://www.googleapis.com/auth/youtube.upload` - Upload videos to YouTube

### Facebook

- `email` - Email address
- `public_profile` - Basic public profile information
