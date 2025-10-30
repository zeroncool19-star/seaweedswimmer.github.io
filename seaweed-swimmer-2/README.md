# 🐠 Seaweed Swimmer 2 - Retro 3D Edition

## Overview
Seaweed Swimmer 2 is a 2.5D underwater game built with React and Babylon.js, featuring:
- **PS1-era retro graphics** (low-poly 3D, CRT scanlines, pixelation)
- **Online leaderboard** with unique usernames
- **All v43 features** (daily challenges, achievements, milestones, near-miss effects)
- **AdMob integration** for Android
- **Progressive difficulty** (max level 20, speed increases every 20 seconds)

## Tech Stack
- **Frontend**: React 19 + Babylon.js 7 + Tailwind CSS
- **Backend**: FastAPI + Motor (async MongoDB)
- **Database**: MongoDB
- **Mobile**: Capacitor 7 + AdMob

## Project Structure
```
/app/seaweed-swimmer-2/
├── backend/
│   ├── server.py          # FastAPI leaderboard API
│   ├── requirements.txt
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── FishGame.jsx    # Main 2.5D game with Babylon.js
    │   │   └── ui/             # Reusable UI components
    │   ├── services/
    │   │   ├── ApiService.js   # Leaderboard API client
    │   │   ├── AudioService.js # Web Audio music & SFX
    │   │   └── AdService.js    # AdMob integration
    │   ├── App.js
    │   └── index.js
    ├── package.json
    ├── capacitor.config.json
    └── build/              # Production build
```

## Features

### Gameplay
- **2.5D Perspective**: Orthographic camera with 3D low-poly models
- **PS1 Visual Style**: 
  - Low-resolution rendering (30% scale)
  - CRT scanlines overlay
  - Vertex wobble effect
  - Chromatic aberration
  - Pixelation post-processing
- **Tap to Swim**: Simple one-button gameplay
- **Time-based Scoring**: Survive as long as possible
- **Progressive Difficulty**: Speed increases every 20 points (max level 20)

### Online Features
- **Global Leaderboard**: Top 100 players worldwide
- **Unique Usernames**: 3-15 characters, alphanumeric + spaces
- **Score Submission**: Manual opt-in after game over
- **Rank Tracking**: See where you stand globally

### Addictiveness Features (from v43)
- **Daily Challenges**: Progressive targets (20s → 300s), streak tracking
- **Score Milestones**: Popup celebrations every 100 seconds
- **Near-Miss Effects**: Visual feedback for close calls
- **8 Achievement Tiers**: Bronze (20s) → Ocean Deity (1000s)

### Audio
- **Underwater ambient music** (Web Audio API)
- **Sound effects** (swim, collision)
- **Toggle controls** (music, SFX, haptics)

### Mobile (Android)
- **Haptic feedback** on tap
- **Status bar** styling
- **Splash screen**
- **AdMob ads** (banner during gameplay, interstitial on game over)

## API Endpoints

### Leaderboard API (`/api/leaderboard/`)
- `POST /submit` - Submit score (creates or updates user)
- `GET /global?limit=100` - Get top N scores
- `GET /check-username?username=X` - Check availability
- `GET /rank/{username}` - Get user's rank

### Request/Response Examples

**Submit Score:**
```json
POST /api/leaderboard/submit
{
  "username": "Player123",
  "score": 150,
  "achievement": "⭐ Deep Sea Explorer"
}

Response:
{
  "id": "uuid",
  "username": "Player123",
  "score": 150,
  "achievement": "⭐ Deep Sea Explorer",
  "timestamp": "2025-01-01T00:00:00Z"
}
```

**Get Leaderboard:**
```json
GET /api/leaderboard/global?limit=10

Response: [
  {
    "id": "uuid",
    "username": "TopPlayer",
    "score": 850,
    "achievement": "🌌 Abyssal Master",
    "timestamp": "2025-01-01T00:00:00Z"
  },
  ...
]
```

## Local Storage Keys
- `seaweedSwimmer2HighScore` - Local high score
- `seaweedSwimmer2Username` - Saved username
- `seaweedSwimmer2Music` - Music toggle (true/false)
- `seaweedSwimmer2Sfx` - SFX toggle (true/false)
- `seaweedSwimmer2Haptics` - Haptics toggle (true/false)
- `seaweedSwimmer2DailyChallenge` - Daily challenge data (JSON)

## Game Constants
```javascript
FISH_SIZE = 0.8           // Fish mesh size
SEAWEED_WIDTH = 1.5       // Obstacle width
SEAWEED_GAP = 4           // Gap between seaweed
GRAVITY = 0.008           // Downward acceleration
FISH_JUMP = -0.22         // Upward velocity on tap
BASE_SEAWEED_SPEED = 0.08 // Base scroll speed
WORLD_WIDTH = 20          // Game world width
WORLD_HEIGHT = 15         // Game world height
```

## Development

### Backend
```bash
cd /app/seaweed-swimmer-2/backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001
```

### Frontend
```bash
cd /app/seaweed-swimmer-2/frontend
yarn install
yarn start   # Development
yarn build   # Production
```

### Build Android APK
```bash
cd /app/seaweed-swimmer-2/frontend
yarn build
npx cap sync android
npx cap open android
# Then build in Android Studio
```

## Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=seaweed_swimmer_2
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=https://swim-challenge.preview.emergentagent.com
WDS_SOCKET_PORT=443
```

## Version History
- **v1.0.0** (Initial Release)
  - 2.5D Babylon.js game engine
  - PS1-era retro visual effects
  - Online leaderboard system
  - All v43 features ported from original Seaweed Swimmer

## Known Limitations
- Shaders are simplified (Babylon.js built-in post-processing)
- 2.5D gameplay (not full 3D movement)
- Username changes require clearing localStorage

## Future Enhancements
- Custom PS1 vertex shaders
- Full 3D fish movement (z-axis swimming)
- Daily/weekly leaderboard divisions
- Social sharing integration
- More seaweed variations

## Credits
- **Game Design**: Based on Seaweed Swimmer v43 by Zeron
- **3D Engine**: Babylon.js
- **Backend**: FastAPI + MongoDB
- **Mobile**: Capacitor

---

**Play Now**: Tap to swim, avoid seaweed, climb the global leaderboard! 🐠🌊
