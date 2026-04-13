// AI Agent Types

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  context?: {
    robotStatus?: any;
    currentLesson?: string;
    userLevel?: 'beginner' | 'intermediate' | 'advanced';
  };
}

export interface ChatResponse {
  message: string;
  conversationId: string;
  codeGenerated?: string;
  documentationReferences?: string[];
  suggestedActions?: string[];
}

export interface AIAgentConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}
