# Deployment Guide for Chat-E2EE

This guide covers deploying the chat-e2ee application to both **Render** and **Firebase**.

---

## 🚀 Deployment Options

### Option 1: Deploy to Render (Full-Stack with Backend)

Render is recommended for deploying the **complete application** (frontend + backend + WebSocket support).

#### Prerequisites
- GitHub account
- Render account (free tier available at https://render.com)
- Optional: MongoDB Atlas account for persistent storage

#### Steps to Deploy on Render

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m"feat: add video call controls and deployment config"
   git push origin main
   ```

2. **Create a New Web Service on Render**
   - Go to https://render.com/dashboard
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Select the `chat-e2ee` repository

3. **Configure the Service**
   Render will auto-detect the `render.yaml` file. Alternatively, use these settings:
   - **Name**: `chat-e2ee` (or your preferred name)
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or your preferred plan)

4. **Set Environment Variables**
   Go to **Environment** tab and add these variables:
   
   **Required:**
   ```
   NODE_ENV=production
   PORT=10000
   CLIENT_ORIGIN=https://YOUR_APP_NAME.onrender.com
   CHAT_LINK_DOMAIN=https://YOUR_APP_NAME.onrender.com
   PUBLIC_SERVER_URL=https://YOUR_APP_NAME.onrender.com
   ```
   
   **Optional (for security & performance):**
   ```
   MAX_JSON_PAYLOAD=25mb
   SOCKET_MAX_PAYLOAD_BYTES=5242880
   ENFORCE_HTTPS=true
   HSTS_MAX_AGE=31536000
   RATE_LIMIT_WINDOW_MS=60000
   RATE_LIMIT_MAX=120
   ```
   
   **Optional (for MongoDB persistence):**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-e2ee
   MONGO_DB_NAME=chat-e2ee
   ```

5. **Deploy**
   - Click **"Create Web Service"**
   - Render will automatically build and deploy your app
   - Access your app at: `https://YOUR_APP_NAME.onrender.com`

#### Important Notes for Render
- ⚠️ Free tier services **sleep after 15 minutes of inactivity**
- First request after sleep may take 30-60 seconds to wake up
- WebSocket connections are fully supported
- HTTPS is automatically enabled

---

### Option 2: Deploy to Firebase (Frontend Only)

Firebase Hosting is ideal for deploying **static frontend** only. For full functionality with backend/WebSocket, you'll need Firebase Functions (paid plan) or use Render for backend.

#### Prerequisites
- Firebase account
- Firebase CLI installed: `npm install -g firebase-tools`

#### Steps to Deploy on Firebase

1. **Login to Firebase**
   ```bash
   firebase login
   ```

2. **Initialize Firebase (if not already done)**
   ```bash
   firebase init
   ```
   - Select **Hosting**
   - Choose existing project: `chat-e2ee-7282d` (or create new)
   - Public directory: `client/build`
   - Configure as single-page app: **Yes**
   - Set up automatic builds: **No** (optional)

3. **Build the Client**
   ```bash
   npm run build-client
   ```

4. **Deploy to Firebase Hosting**
   ```bash
   firebase deploy --only hosting
   ```

5. **Access Your App**
   - Your app will be live at: `https://chat-e2ee-7282d.web.app`

#### Hybrid Approach: Firebase + Render
For best results, use **Firebase for frontend** and **Render for backend**:

1. Deploy backend to Render (follow Render steps above)
2. Update client environment to point to Render backend:
   - Edit `client/.env.production`:
     ```
     REACT_APP_API_URL=https://YOUR_RENDER_APP.onrender.com
     REACT_APP_SOCKET_URL=https://YOUR_RENDER_APP.onrender.com
     ```
3. Build and deploy frontend to Firebase
4. Update Render environment variables:
   ```
   CLIENT_ORIGIN=https://chat-e2ee-7282d.web.app
   CHAT_LINK_DOMAIN=https://chat-e2ee-7282d.web.app
   ```

---

## 🔐 Security Considerations

### Environment Variables
Never commit sensitive data to Git. Always use environment variables for:
- Database connection strings (`MONGO_URI`)
- API keys
- Domain URLs

### CORS Configuration
Update `CLIENT_ORIGIN` to include all domains where your frontend is hosted:
```
CLIENT_ORIGIN=https://your-app.onrender.com,https://chat-e2ee-7282d.web.app
```

### Rate Limiting
Adjust rate limits based on expected traffic:
- `RATE_LIMIT_WINDOW_MS`: Time window in milliseconds
- `RATE_LIMIT_MAX`: Max requests per window

---

## 🧪 Testing Deployment

After deployment, test these features:

1. ✅ **Chat Creation**: Generate a unique link
2. ✅ **Messaging**: Send encrypted messages between two browsers
3. ✅ **Audio Call**: Start an audio call
4. ✅ **Video Call**: Start a video call with camera enabled
5. ✅ **Voice Clips**: Record and send voice messages
6. ✅ **File Uploads**: Share encrypted files

---

## 📊 Monitoring

### Render Dashboard
- View logs: https://dashboard.render.com → Your Service → Logs
- Monitor metrics: CPU, Memory, Request count
- Set up health checks

### Firebase Console
- Analytics: https://console.firebase.google.com
- Hosting metrics
- Performance monitoring (optional)

---

## 🆘 Troubleshooting

### Render Issues

**Problem**: Service won't start
- Check build logs for errors
- Verify all environment variables are set
- Ensure `PORT` is set to `10000` (Render requirement)

**Problem**: WebSocket connection fails
- Verify `CLIENT_ORIGIN` includes your frontend URL
- Check CORS configuration
- Ensure HTTPS is enabled

**Problem**: Slow cold starts (Free tier)
- Upgrade to paid plan for always-on service
- Or accept 30-60s wake-up time on first request

### Firebase Issues

**Problem**: 404 errors after deployment
- Ensure `client/build` directory exists
- Verify `firebase.json` rewrites configuration
- Check SPA configuration is enabled

**Problem**: API calls failing
- Verify backend URL in client environment variables
- Check CORS settings on backend
- Ensure backend is running (if using Render)

---

## 🔄 CI/CD (Optional)

### Auto-deploy from GitHub

**Render**: Automatically deploys on push to `main` branch (configured in `render.yaml`)

**Firebase**: Set up GitHub Actions
Create `.github/workflows/firebase-deploy.yml`:
```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run build-client
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: chat-e2ee-7282d
```

---

## 📝 Summary

| Platform | Best For | WebSocket | Backend | Cost |
|----------|----------|-----------|---------|------|
| **Render** | Full-stack app | ✅ Yes | ✅ Yes | Free tier available |
| **Firebase Hosting** | Static frontend | ❌ No* | ❌ No* | Free tier generous |
| **Hybrid (Firebase + Render)** | Scalable setup | ✅ Yes | ✅ Yes | Both free tiers |

*Firebase Functions can provide backend/WebSocket but requires paid plan

**Recommended**: Deploy to **Render** for simplest full-featured deployment.

---

For questions or issues, refer to:
- Render Docs: https://render.com/docs
- Firebase Docs: https://firebase.google.com/docs/hosting
