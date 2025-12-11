# Quick Deployment Reference

## 🎯 Choose Your Deployment Platform

### Option 1: Render (Recommended) ⭐
**Best for**: Full-stack with WebSocket support
**Time**: 5-10 minutes
**Cost**: Free tier available

```bash
# 1. Push to GitHub
git add .
git commit -m"feat: ready for deployment"
git push origin main

# 2. Go to https://render.com
# 3. New Web Service → Connect your repo
# 4. Render auto-detects render.yaml
# 5. Add environment variables
# 6. Deploy!
```

**Environment Variables to Set:**
- `CLIENT_ORIGIN=https://YOUR-APP.onrender.com`
- `CHAT_LINK_DOMAIN=https://YOUR-APP.onrender.com`
- `PUBLIC_SERVER_URL=https://YOUR-APP.onrender.com`

---

### Option 2: Firebase Hosting
**Best for**: Static frontend only
**Time**: 3-5 minutes
**Cost**: Free (generous limits)

```bash
# Quick deploy
npm run deploy:firebase

# Or manually
npm run build-client
firebase deploy --only hosting

# Or use script
./deploy-firebase.bat  # Windows
./deploy-firebase.sh   # Linux/Mac
```

**Note**: Backend features require separate hosting (use Render or Firebase Functions)

---

### Option 3: Hybrid (Firebase + Render) 🚀
**Best for**: Scalable production setup
**Time**: 10-15 minutes

**Step 1: Deploy Backend to Render**
```bash
# Follow Option 1 above for backend
```

**Step 2: Deploy Frontend to Firebase**
```bash
# Update client/.env.production
REACT_APP_API_URL=https://YOUR-RENDER-APP.onrender.com
REACT_APP_SOCKET_URL=https://YOUR-RENDER-APP.onrender.com

# Build and deploy
npm run deploy:firebase
```

**Step 3: Update Render Environment**
```
CLIENT_ORIGIN=https://chat-e2ee-7282d.web.app
CHAT_LINK_DOMAIN=https://chat-e2ee-7282d.web.app
```

---

## 🔐 Environment Variables Quick Reference

| Variable | Value | Where |
|----------|-------|-------|
| `NODE_ENV` | `production` | Render |
| `PORT` | `10000` | Render |
| `CLIENT_ORIGIN` | Your frontend URL | Render |
| `CHAT_LINK_DOMAIN` | Your frontend URL | Render |
| `PUBLIC_SERVER_URL` | Your backend URL | Render |

---

## ✅ Post-Deployment Checklist

- [ ] Open your deployed URL
- [ ] Generate a chat link
- [ ] Open link in two browsers/tabs
- [ ] Test text messaging
- [ ] Test audio call
- [ ] Test video call (camera should open on both sides)
- [ ] Test voice recording
- [ ] Test file upload
- [ ] Check HTTPS is enabled
- [ ] Verify WebSocket connection (check browser console)

---

## 🆘 Quick Troubleshooting

**Problem**: Service won't start on Render
- ✅ Check `PORT` is set to `10000`
- ✅ Verify build logs for errors
- ✅ Ensure all environment variables are set

**Problem**: WebSocket connection fails
- ✅ Check `CLIENT_ORIGIN` includes your frontend URL
- ✅ Verify HTTPS is enabled
- ✅ Check CORS configuration

**Problem**: Video call doesn't work
- ✅ Ensure HTTPS is enabled (required for camera access)
- ✅ Grant camera/microphone permissions in browser
- ✅ Check browser console for errors

**Problem**: Firebase deployment 404 errors
- ✅ Run `npm run build-client` first
- ✅ Check `client/build` directory exists
- ✅ Verify `firebase.json` is correct

---

## 📱 Testing Deployment

### Local Testing Before Deploy
```bash
# Build production version locally
npm run build
npm start

# Visit http://localhost:10000
```

### Test on Multiple Devices
1. Deploy to Render/Firebase
2. Open on desktop browser
3. Open same link on mobile
4. Test video call between devices

---

## 🎉 Success!

Your chat-e2ee app is now live! Share the link and enjoy secure, encrypted communication.

**Need help?** Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.
