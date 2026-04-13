# WLKATA Learning Platform - Quick Start Guide

Get the backend up and running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Anthropic API key (for AI features)
- WLKATA robot (optional - mock mode works without hardware)

---

## Step 1: Clone and Install

```bash
# Clone the repository
git clone git@github.com:lsajid/wlkata-demo-1.git
cd wlkata-demo-1

# Install dependencies
npm install
```

---

## Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your settings
nano .env  # or use your preferred editor
```

**Required:** Add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

Get your API key from: https://console.anthropic.com/

**Optional:** Configure robot port (if using physical robot):
```
ROBOT_DEFAULT_PORT=/dev/ttyUSB0
```

---

## Step 3: Start Development Server

```bash
npm run dev
```

The server will start at: `http://localhost:3000`

---

## Step 4: Test the APIs

### Test 1: Robot Status
```bash
curl http://localhost:3000/api/robot/status
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "connected": false,
    "homed": false,
    "mode": "idle"
  }
}
```

### Test 2: AI Chat (requires API key)
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is robot homing?"}'
```

**Expected:** AI response about robot homing

### Test 3: Search Documentation
```bash
curl -X POST http://localhost:3000/api/knowledge/search \
  -H "Content-Type: application/json" \
  -d '{"query": "homing"}'
```

**Expected:** Documentation search results

---

## Step 5: Explore the APIs

Check `API_EXAMPLES.md` for complete API documentation with examples.

**Available APIs:**

**Robot Control:**
- `GET /api/robot/status` - Get robot status
- `POST /api/robot/connect` - Connect to robot
- `POST /api/robot/command` - Execute robot commands

**AI Assistant:**
- `POST /api/ai/chat` - Chat with AI teacher
- `POST /api/ai/generate-code` - Generate robot code

**Knowledge Base:**
- `POST /api/knowledge/search` - Search documentation
- `GET /api/knowledge/modules` - Get learning modules

---

## Project Structure

```
walkata-demo/
├── app/
│   ├── api/              # API routes
│   │   ├── robot/        # Robot control endpoints
│   │   ├── ai/           # AI assistant endpoints
│   │   └── knowledge/    # Learning content endpoints
│   └── page.tsx          # Frontend (Next.js)
│
├── lib/
│   ├── services/         # Backend logic
│   │   ├── robotService.ts      # Robot control
│   │   ├── aiService.ts         # Claude AI integration
│   │   └── knowledgeService.ts  # Documentation & modules
│   ├── types/            # TypeScript definitions
│   └── utils/            # Utilities & validation
│
├── .env                  # Environment variables (create this)
├── .env.example          # Environment template
├── API_EXAMPLES.md       # API documentation
└── BACKEND_README.md     # Backend architecture docs
```

---

## Common Issues

### Issue: "Anthropic API key not configured"

**Solution:** Make sure `.env` file exists and contains:
```
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key
```

### Issue: "Port 3000 already in use"

**Solution:** Stop other processes or use a different port:
```bash
npm run dev -- -p 3001
```

### Issue: AI responses are slow

**Solution:** This is normal - Claude API calls take 2-5 seconds. Consider adding loading states in your frontend.

### Issue: Robot not connecting

**Solution:**
1. Check that robot is powered on and connected via USB
2. Verify correct port in `.env`:
   - Linux: `/dev/ttyUSB0`
   - Mac: `/dev/tty.usbserial-xxxx`
   - Windows: `COM3` (or check Device Manager)
3. Robot service currently uses mock mode - actual serial communication will be added later

---

## Next Steps

### For Frontend Development

1. Check `API_EXAMPLES.md` for integration examples
2. All endpoints return JSON with consistent format:
   ```json
   {
     "success": true|false,
     "data": {...}
   }
   ```
3. Use TypeScript types from `lib/types/` for type safety

### For Backend Development

1. Read `BACKEND_README.md` for architecture details
2. Services are in `lib/services/` - extend as needed
3. Add new API routes in `app/api/`
4. Update types in `lib/types/` when adding features

### Adding Real WLKATA Documentation

1. Place PDF manuals in `lib/data/docs/`
2. Update `knowledgeService.ts` to load real content
3. Replace sample documentation with actual WLKATA guides

---

## Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables for Production

Set these in your hosting platform:
- `ANTHROPIC_API_KEY` - Your Claude API key
- `ROBOT_DEFAULT_PORT` - Robot serial port
- `NODE_ENV=production`

### Recommended Hosting

- **Vercel** - Easiest for Next.js (free tier available)
- **Railway** - Good for full-stack apps
- **AWS/GCP** - For enterprise deployments

---

## Getting Help

- Check `API_EXAMPLES.md` for API usage
- Check `BACKEND_README.md` for architecture
- Review code in `lib/services/` for implementation details

---

## Development Workflow

```bash
# 1. Make changes to code
# 2. Test locally
npm run dev

# 3. Run linter
npm run lint

# 4. Build to check for errors
npm run build

# 5. Commit changes
git add .
git commit -m "Your message"
git push
```

---

**You're all set!** The backend is ready for frontend integration.
