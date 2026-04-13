// Knowledge Base & Learning Module Types

export interface DocumentChunk {
  id: string;
  content: string;
  source: string;
  category: 'setup' | 'programming' | 'troubleshooting' | 'concepts' | 'hardware' | 'vision' | 'advanced';
  metadata: {
    title: string;
    page?: number;
    section?: string;
  };
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  lessons: Lesson[];
  estimatedTime: number; // in minutes
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  codeExamples?: CodeExample[];
  exercises?: Exercise[];
  order: number;
}

export interface CodeExample {
  language: 'python' | 'javascript' | 'blockly' | 'gcode';
  code: string;
  description: string;
  runnable: boolean;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  task: string;
  hints?: string[];
  solution?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface SearchQuery {
  query: string;
  category?: string;
  limit?: number;
}

export interface SearchResult {
  chunks: DocumentChunk[];
  totalResults: number;
}
