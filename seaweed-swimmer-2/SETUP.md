# Seaweed Swimmer 2 - Setup & Deployment Guide

## Quick Start (Development)

### 1. Backend Setup
```bash
cd /app/seaweed-swimmer-2/backend

# MongoDB should already be running from main app
# Update .env if needed (MONGO_URL is already configured)

# Start backend on a different port (8002) to avoid conflict
uvicorn server:app --host 0.0.0.0 --port 8002 --reload
```

### 2. Frontend Development
```bash
cd /app/seaweed-swimmer-2/frontend

# Start dev server
yarn start

# Or build for production
yarn build
```

### 3. Test Backend API
```bash
# Health check
curl http://localhost:8002/api/

# Check username availability
curl "http://localhost:8002/api/leaderboard/check-username?username=TestUser"

# Submit score
curl -X POST http://localhost:8002/api/leaderboard/submit \
  -H "Content-Type: application/json" \
  -d '{"username":"TestUser","score":100,"achievement":"🥇 Gold Swimmer"}'

# Get leaderboard
curl http://localhost:8002/api/leaderboard/global?limit=10
```

## Production Deployment

### Option 1: Run on Same Server (Different Port)
The SW2 backend can run on port 8002 while original backend runs on 8001.

**Update supervisor config** (`/etc/supervisor/conf.d/backend_sw2.conf`):
```ini
[program:backend_sw2]
directory=/app/seaweed-swimmer-2/backend
command=uvicorn server:app --host 0.0.0.0 --port 8002
autostart=true
autorestart=true
stderr_logfile=/var/log/supervisor/backend_sw2.err.log
stdout_logfile=/var/log/supervisor/backend_sw2.out.log
```

Then:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start backend_sw2
```

### Option 2: Replace Original App
If you want to replace the original Seaweed Swimmer:

1. **Backup original:**
```bash
mv /app/frontend /app/frontend_v43_backup
mv /app/backend /app/backend_v43_backup
```

2. **Move SW2 to main location:**
```bash
cp -r /app/seaweed-swimmer-2/frontend /app/frontend
cp -r /app/seaweed-swimmer-2/backend /app/backend
```

3. **Update backend .env:**
```bash
# Edit /app/backend/.env
MONGO_URL=mongodb://localhost:27017
DB_NAME=seaweed_swimmer_2
```

4. **Restart services:**
```bash
sudo supervisorctl restart all
```

## Android Build

### 1. Sync Capacitor
```bash
cd /app/seaweed-swimmer-2/frontend
yarn build
npx cap sync android
```

### 2. Open in Android Studio
```bash
npx cap open android
```

### 3. Build APK/AAB
- In Android Studio: Build > Generate Signed Bundle / APK
- Update version code in `android/app/build.gradle`
- Use existing keystore from v43 or create new one

## Environment Configuration

### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=seaweed_swimmer_2
```

### Frontend (.env)
For production deployment, update:
```env
REACT_APP_BACKEND_URL=https://your-domain.com
WDS_SOCKET_PORT=443
```

For local development with SW2 backend on port 8002:
```env
REACT_APP_BACKEND_URL=http://localhost:8002
```

## Testing Checklist

### Backend Tests
- [ ] Health check endpoint responds
- [ ] Username validation (length, characters, uniqueness)
- [ ] Score submission creates new entry
- [ ] Score submission updates existing entry only if higher
- [ ] Leaderboard returns sorted results
- [ ] Leaderboard limits to requested count
- [ ] User rank calculation correct

### Frontend Tests  
- [ ] 3D scene renders (Babylon.js canvas visible)
- [ ] Fish model appears
- [ ] Seaweed obstacles spawn and move
- [ ] Tap/click makes fish jump
- [ ] Collision detection works (game over on hit)
- [ ] Score increments over time
- [ ] Difficulty increases every 20 seconds
- [ ] PS1 effects visible (scanlines, pixelation)
- [ ] Username prompt appears when no username saved
- [ ] Leaderboard screen loads and displays scores
- [ ] Score submission works after game over
- [ ] Daily challenge system tracks progress
- [ ] Milestones popup at 100s intervals
- [ ] Near-miss effects trigger correctly
- [ ] Audio plays (music & SFX)
- [ ] Settings toggles work (music, SFX, haptics)

### Mobile Tests (Android)
- [ ] App installs from APK
- [ ] Splash screen shows
- [ ] 3D game renders on device
- [ ] Touch controls work
- [ ] Haptic feedback works
- [ ] Banner ads show during gameplay
- [ ] Interstitial ad shows on game over
- [ ] Orientation locks correctly
- [ ] Performance is smooth (30+ FPS)

## Troubleshooting

### Backend Issues

**MongoDB connection error:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Check connection string in .env
cat /app/seaweed-swimmer-2/backend/.env
```

**Port already in use:**
```bash
# Find process using port
sudo lsof -i :8002

# Kill if needed
sudo kill -9 <PID>
```

### Frontend Issues

**Babylon.js not rendering:**
- Check browser console for WebGL errors
- Ensure canvas element is visible
- Check if scene is being created properly

**Leaderboard not loading:**
- Check REACT_APP_BACKEND_URL in .env
- Verify backend is running
- Check browser network tab for API errors
- Check CORS headers on backend

**Build fails:**
- Clear cache: `rm -rf node_modules yarn.lock && yarn install`
- Check for syntax errors in FishGame.jsx

**Black screen on mobile:**
- Babylon.js may have performance issues on low-end devices
- Check Android WebView version (need 60+)
- Enable hardware acceleration in Capacitor config

## Performance Optimization

### Reduce Babylon.js Load
- Lower post-processing quality
- Reduce seaweed spawn rate
- Simplify fish model (fewer vertices)
- Disable shadows if performance poor

### Reduce Bundle Size
- Remove unused Babylon.js modules
- Use code splitting for routes
- Optimize images and assets

## Database Management

### View Leaderboard Data
```bash
mongosh
use seaweed_swimmer_2
db.leaderboard.find().sort({score: -1}).limit(10)
```

### Clear Leaderboard
```bash
mongosh
use seaweed_swimmer_2
db.leaderboard.deleteMany({})
```

### Backup Database
```bash
mongodump --db=seaweed_swimmer_2 --out=/backup/sw2
```

## URLs & Endpoints

- **Frontend (dev)**: http://localhost:3000
- **Backend (dev)**: http://localhost:8002
- **API Base**: http://localhost:8002/api
- **Leaderboard**: http://localhost:8002/api/leaderboard/global

## Next Steps

1. Test backend API endpoints thoroughly
2. Test frontend 3D rendering and gameplay
3. Test leaderboard integration end-to-end
4. Test on mobile device (Android)
5. Optimize performance if needed
6. Deploy to production

## Support

For issues or questions:
1. Check browser console for errors
2. Check backend logs: `tail -f /var/log/supervisor/backend_sw2*.log`
3. Check MongoDB connection
4. Verify environment variables are set correctly
