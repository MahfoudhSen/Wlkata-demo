# WLKATA Backend API

Backend system for the AI-powered WLKATA robotics learning platform.

## Architecture

```
lib/
├── services/          # Core business logic
│   ├── robotService.ts    # Robot control and communication
│   ├── aiService.ts       # Claude AI integration
│   └── knowledgeService.ts # Documentation and learning modules
├── types/            # TypeScript type definitions
├── utils/            # Utility functions and configuration
└── db/              # Database models and queries

app/api/             # Next.js API routes
├── robot/           # Robot control endpoints
│   ├── status/
│   ├── connect/
│   └── command/
├── ai/              # AI assistant endpoints
│   ├── chat/
│   └── generate-code/
└── knowledge/       # Learning content endpoints
    ├── search/
    ├── modules/
    └── modules/[id]/
```

## API Endpoints

### Robot Control

**GET** `/api/robot/status`
Get current robot status

**POST** `/api/robot/connect`
```json
{ "port": "/dev/ttyUSB0" }
```

**DELETE** `/api/robot/connect`
Disconnect from robot

**POST** `/api/robot/command`
```json
{
  "type": "move",
  "position": { "x": 100, "y": 150, "z": 200 },
  "speed": 1000
}
```

### AI Assistant

**POST** `/api/ai/chat`
```json
{
  "message": "How do I move the robot to home position?",
  "conversationId": "optional_conv_id",
  "context": {
    "userLevel": "beginner"
  }
}
```

**POST** `/api/ai/generate-code`
```json
{
  "description": "Pick up an object and place it in bin 2",
  "language": "python"
}
```

### Knowledge Base

**POST** `/api/knowledge/search`
```json
{
  "query": "robot homing",
  "category": "setup",
  "limit": 5
}
```

**GET** `/api/knowledge/modules`
Get all learning modules

**GET** `/api/knowledge/modules/[id]`
Get specific module with lessons

## Environment Variables

Create a `.env` file:

```bash
ANTHROPIC_API_KEY=your_api_key
ROBOT_DEFAULT_PORT=/dev/ttyUSB0
DATABASE_URL=postgresql://...
NODE_ENV=development
```

## Setup

```bash
npm install
npm run dev
```

## Services

### RobotService
Handles WLKATA robot communication via serial port, G-code commands, and status monitoring.

### AIService
Integrates Claude API for conversational teaching assistance and code generation.

### KnowledgeService
Manages documentation search, learning modules, and lesson content.

## Next Steps

- [ ] Implement actual serial communication (node-serialport)
- [ ] Add database integration for user progress
- [ ] Implement vector search for documentation
- [ ] Add WebSocket for real-time robot status
- [ ] Add authentication and user management
