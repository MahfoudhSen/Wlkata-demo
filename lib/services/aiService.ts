import Anthropic from '@anthropic-ai/sdk';
import type { ChatRequest, ChatResponse, Message, AIAgentConfig } from '../types';

class AIService {
  private client: Anthropic | null = null;
  private conversationHistory: Map<string, Message[]> = new Map();

  private config: AIAgentConfig = {
    model: 'claude-3-5-sonnet-20241022',
    temperature: 0.7,
    maxTokens: 2048,
    systemPrompt: `You are an expert robotics teaching assistant for the WLKATA robotic arm learning platform.

Your role is to:
1. Help students learn robotics concepts in a clear, beginner-friendly way
2. Generate Python, JavaScript, or G-code for robot control
3. Explain how the WLKATA robot works
4. Debug student programs and explain errors
5. Guide students through hands-on exercises
6. Reference WLKATA documentation when needed

When generating code:
- Include clear comments explaining each step
- Use safe parameters to avoid robot damage
- Explain what the code does physically on the robot

When explaining concepts:
- Start with simple explanations
- Use analogies when helpful
- Connect theory to the physical robot
- Encourage experimentation

Be encouraging, patient, and educational. Make robotics accessible and fun!`
  };

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey) {
      this.client = new Anthropic({ apiKey });
    }
  }

  initialize(apiKey: string): void {
    this.client = new Anthropic({ apiKey });
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      if (!this.client) {
        throw new Error('Anthropic API key not configured. Please set ANTHROPIC_API_KEY in .env');
      }

      const conversationId = request.conversationId || this.generateConversationId();
      const history = this.conversationHistory.get(conversationId) || [];

      const userMessage: Message = {
        role: 'user',
        content: request.message,
        timestamp: new Date()
      };
      history.push(userMessage);

      let contextPrompt = request.message;
      if (request.context) {
        contextPrompt = this.buildContextPrompt(request.message, request.context);
      }

      const response = await this.client.messages.create({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        system: this.config.systemPrompt,
        messages: history.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      });

      const content = response.content[0].type === 'text' ? response.content[0].text : '';

      const assistantMessage: Message = {
        role: 'assistant',
        content,
        timestamp: new Date()
      };
      history.push(assistantMessage);

      this.conversationHistory.set(conversationId, history);

      const parsed = this.parseResponse(content);

      return {
        message: content,
        conversationId,
        codeGenerated: parsed.code,
        documentationReferences: parsed.docRefs,
        suggestedActions: parsed.actions
      };

    } catch (error) {
      if (error instanceof Anthropic.APIError) {
        throw new Error(`Claude API error: ${error.message}`);
      }
      throw new Error(`AI service error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildContextPrompt(message: string, context: any): string {
    let prompt = message;

    if (context.robotStatus) {
      prompt += `\n\nCurrent robot status:\n${JSON.stringify(context.robotStatus, null, 2)}`;
    }

    if (context.currentLesson) {
      prompt += `\n\nStudent is currently working on: ${context.currentLesson}`;
    }

    if (context.userLevel) {
      prompt += `\n\nStudent level: ${context.userLevel}`;
    }

    return prompt;
  }

  private parseResponse(content: string): {
    code?: string;
    docRefs?: string[];
    actions?: string[];
  } {
    const result: any = {};

    const codeMatch = content.match(/```(?:python|javascript|gcode)?\n([\s\S]*?)```/);
    if (codeMatch) {
      result.code = codeMatch[1].trim();
    }

    const docPattern = /(?:see|refer to|check)\s+([A-Z][a-zA-Z\s]+(?:Manual|Guide|Documentation))/gi;
    const docMatches = content.match(docPattern);
    if (docMatches) {
      result.docRefs = docMatches;
    }

    const actionPattern = /(?:try|you should|next step|now):\s*([^.!?\n]+)/gi;
    const actionMatches = [...content.matchAll(actionPattern)];
    if (actionMatches.length > 0) {
      result.actions = actionMatches.map(m => m[1].trim());
    }

    return result;
  }

  private generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getConversationHistory(conversationId: string): Message[] {
    return this.conversationHistory.get(conversationId) || [];
  }

  clearConversation(conversationId: string): void {
    this.conversationHistory.delete(conversationId);
  }

  async generateRobotCode(description: string, language: 'python' | 'javascript' | 'gcode'): Promise<string> {
    const prompt = `Generate ${language} code for the WLKATA robot to: ${description}

Requirements:
- Include safety checks
- Add clear comments
- Use appropriate speed and positioning
- Handle errors gracefully

Return only the code with comments, no additional explanation.`;

    const response = await this.chat({
      message: prompt,
      context: { userLevel: 'beginner' }
    });

    return response.codeGenerated || response.message;
  }
}

export const aiService = new AIService();
