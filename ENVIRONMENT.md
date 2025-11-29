# Environment Configuration Guide

This project uses Vite environment variables for configuration. Follow this guide to set up your environment correctly.

## Environment Variables

### Development Environment

When running `pnpm dev`, the application will use:
- **VITE_API_BASE_URL_DEV**: Your local development API URL
- Default: `http://localhost:3000`

### Production Environment

When building with `pnpm build`, the application will use:
- **VITE_API_BASE_URL_PROD**: Your production API URL
- Example: `https://api.yourapp.com`

### Fallback

If environment-specific variables are not set, the application will fall back to:
- **VITE_API_BASE_URL**: Generic API URL
- Default: `http://localhost:3000`

## Setup Instructions

### 1. Create Local Environment File

```bash
cp .env.example .env
```

### 2. Configure Your Environment

Edit `.env` and set your API URLs:

```bash
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here

# API Configuration
VITE_API_BASE_URL_DEV=http://localhost:3000
VITE_API_BASE_URL_PROD=https://api.yourapp.com
VITE_API_BASE_URL=http://localhost:3000
```

### 3. For Team Collaboration

**DO NOT commit `.env` to git**. It's already in `.gitignore`.

Each team member should:
1. Copy `.env.example` to `.env`
2. Set their own local values
3. Never commit `.env` to version control

## How It Works

The Axios client (`src/lib/api/client.ts`) automatically selects the correct API URL based on:

1. **Production Build** (`pnpm build`):
   - Uses `VITE_API_BASE_URL_PROD` if set
   - Falls back to `VITE_API_BASE_URL`
   - Falls back to `http://localhost:3000`

2. **Development** (`pnpm dev`):
   - Uses `VITE_API_BASE_URL_DEV` if set
   - Falls back to `VITE_API_BASE_URL`
   - Falls back to `http://localhost:3000`

## Example Configurations

### Local Development (Backend on localhost:3000)
```bash
VITE_API_BASE_URL_DEV=http://localhost:3000
```

### Local Development (Backend on different port)
```bash
VITE_API_BASE_URL_DEV=http://localhost:8080
```

### Local Development (Backend on network IP)
```bash
VITE_API_BASE_URL_DEV=http://192.168.1.100:3000
```

### Production
```bash
VITE_API_BASE_URL_PROD=https://api.production.com
```

### Staging
```bash
VITE_API_BASE_URL_PROD=https://api.staging.com
```

## Verifying Configuration

To check which URL is being used:

1. Start the dev server: `pnpm dev`
2. Open browser console
3. Check network requests in DevTools
4. API calls should go to your configured URL

## Troubleshooting

### Issue: API calls go to wrong URL

**Solution**: 
- Check `.env` file exists
- Verify variable names are correct (must start with `VITE_`)
- Restart the dev server after changing `.env`

### Issue: CORS errors

**Solution**:
- Ensure your backend allows requests from your frontend URL
- Check backend CORS configuration
- Verify API URL is correct (http vs https, port number)

### Issue: 404 errors on API endpoints

**Solution**:
- Verify API base URL doesn't have trailing slash
- Check endpoint paths in API service files
- Confirm backend routes match frontend expectations

## Security Notes

⚠️ **IMPORTANT**: 
- Environment variables prefixed with `VITE_` are **exposed to the client**
- Never put sensitive secrets in `VITE_` variables
- API keys and secrets should be handled on the backend
- The Clerk publishable key is safe to expose (it's public by design)
