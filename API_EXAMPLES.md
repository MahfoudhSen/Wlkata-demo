# WLKATA Backend API Examples

Quick reference for testing and integrating with the backend APIs.

## Setup

1. Start the development server:
```bash
npm run dev
```

2. Ensure `.env` file has your API key:
```
ANTHROPIC_API_KEY=your_key_here
```

---

## Robot Control APIs

### Get Robot Status

```bash
curl http://localhost:3000/api/robot/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "connected": false,
    "homed": false,
    "mode": "idle",
    "currentPosition": { "x": 0, "y": 0, "z": 0 },
    "jointAngles": { "joint1": 0, "joint2": 0, "joint3": 0, "joint4": 0 }
  }
}
```

### Connect to Robot

```bash
curl -X POST http://localhost:3000/api/robot/connect \
  -H "Content-Type: application/json" \
  -d '{"port": "/dev/ttyUSB0"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully connected to WLKATA robot",
  "data": { "port": "/dev/ttyUSB0" }
}
```

### Home Robot

```bash
curl -X POST http://localhost:3000/api/robot/command \
  -H "Content-Type: application/json" \
  -d '{"type": "home"}'
```

### Move to Position

```bash
curl -X POST http://localhost:3000/api/robot/command \
  -H "Content-Type: application/json" \
  -d '{
    "type": "move",
    "position": {"x": 100, "y": 150, "z": 200},
    "speed": 1000
  }'
```

### Move Using Joint Angles

```bash
curl -X POST http://localhost:3000/api/robot/command \
  -H "Content-Type: application/json" \
  -d '{
    "type": "move",
    "jointAngles": {"joint1": 45, "joint2": 30, "joint3": 60, "joint4": 0},
    "speed": 500
  }'
```

### Control Gripper

```bash
# Close gripper
curl -X POST http://localhost:3000/api/robot/command \
  -H "Content-Type: application/json" \
  -d '{"type": "grip"}'

# Open gripper
curl -X POST http://localhost:3000/api/robot/command \
  -H "Content-Type: application/json" \
  -d '{"type": "release"}'
```

### Stop Robot

```bash
curl -X POST http://localhost:3000/api/robot/command \
  -H "Content-Type: application/json" \
  -d '{"type": "stop"}'
```

---

## AI Assistant APIs

### Chat with AI

```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I move the robot to home position?",
    "context": {
      "userLevel": "beginner"
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "To move the robot to home position, you need to...",
    "conversationId": "conv_1234567890_abc",
    "suggestedActions": ["Try running the homing command"]
  }
}
```

### Chat with Conversation History

```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Can you show me the code?",
    "conversationId": "conv_1234567890_abc"
  }'
```

### Generate Robot Code

```bash
curl -X POST http://localhost:3000/api/ai/generate-code \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Pick up an object and place it 10cm to the right",
    "language": "python"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "code": "# Python code here\nrobot.move_to(x=100, y=100, z=50)\n..."
  }
}
```

---

## Knowledge Base APIs

### Search Documentation

```bash
curl -X POST http://localhost:3000/api/knowledge/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "robot homing",
    "limit": 5
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "chunks": [
      {
        "id": "doc_001",
        "content": "Robot homing is the process...",
        "source": "WLKATA User Manual",
        "category": "setup",
        "metadata": {
          "title": "Robot Homing Procedure"
        }
      }
    ],
    "totalResults": 1
  }
}
```

### Search by Category

```bash
curl -X POST http://localhost:3000/api/knowledge/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "error",
    "category": "troubleshooting",
    "limit": 10
  }'
```

### Get All Learning Modules

```bash
curl http://localhost:3000/api/knowledge/modules
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "module_001",
      "title": "Introduction to WLKATA Robotics",
      "level": "beginner",
      "lessons": [...]
    }
  ]
}
```

### Get Specific Module

```bash
curl http://localhost:3000/api/knowledge/modules/module_001
```

---

## Frontend Integration Examples

### React/Next.js Example

```typescript
// Example: Move robot to position
async function moveRobot(x: number, y: number, z: number) {
  const response = await fetch('/api/robot/command', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'move',
      position: { x, y, z },
      speed: 1000
    })
  });

  const data = await response.json();
  if (data.success) {
    console.log('Robot moved successfully');
  } else {
    console.error('Error:', data.error);
  }
}

// Example: Chat with AI
async function askAI(question: string, conversationId?: string) {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: question,
      conversationId,
      context: { userLevel: 'beginner' }
    })
  });

  const data = await response.json();
  return data.data;
}

// Example: Search documentation
async function searchDocs(query: string) {
  const response = await fetch('/api/knowledge/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      limit: 5
    })
  });

  const data = await response.json();
  return data.data.chunks;
}
```

---

## Error Handling

All endpoints return consistent error format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad request (validation failed)
- `404` - Not found
- `500` - Server error

---

## Testing Checklist

- [ ] Robot status endpoint works
- [ ] Robot connect/disconnect works
- [ ] Movement commands execute
- [ ] AI chat responds correctly
- [ ] Code generation works
- [ ] Documentation search returns results
- [ ] Learning modules load properly
- [ ] Error handling works for invalid inputs
