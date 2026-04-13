import { z } from 'zod';

export const RobotPositionSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
  rx: z.number().optional(),
  ry: z.number().optional(),
  rz: z.number().optional(),
});

export const JointAnglesSchema = z.object({
  joint1: z.number(),
  joint2: z.number(),
  joint3: z.number(),
  joint4: z.number(),
  joint5: z.number().optional(),
  joint6: z.number().optional(),
});

export const RobotCommandSchema = z.object({
  type: z.enum(['move', 'home', 'grip', 'release', 'stop', 'pause', 'resume']),
  position: RobotPositionSchema.optional(),
  jointAngles: JointAnglesSchema.optional(),
  speed: z.number().min(1).max(5000).optional(),
  gripperState: z.boolean().optional(),
});

export const ChatRequestSchema = z.object({
  message: z.string().min(1).max(5000),
  conversationId: z.string().optional(),
  context: z.object({
    robotStatus: z.any().optional(),
    currentLesson: z.string().optional(),
    userLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  }).optional(),
});

export const GenerateCodeSchema = z.object({
  description: z.string().min(1).max(1000),
  language: z.enum(['python', 'javascript', 'gcode']),
});

export const SearchQuerySchema = z.object({
  query: z.string().min(1).max(500),
  category: z.enum(['setup', 'programming', 'troubleshooting', 'concepts', 'hardware', 'vision', 'advanced']).optional(),
  limit: z.number().min(1).max(50).optional(),
});

export const ConnectRequestSchema = z.object({
  port: z.string().optional(),
});
