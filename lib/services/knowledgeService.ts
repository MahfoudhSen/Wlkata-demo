// Knowledge Base Service
// Manages WLKATA documentation and learning modules

import type { DocumentChunk, LearningModule, Lesson, SearchQuery, SearchResult } from '../types';

class KnowledgeService {
  private documents: Map<string, DocumentChunk> = new Map();
  private modules: Map<string, LearningModule> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  /**
   * Search documentation
   */
  async searchDocumentation(query: SearchQuery): Promise<SearchResult> {
    try {
      const results: DocumentChunk[] = [];
      const searchTerms = query.query.toLowerCase().split(' ');

      // Simple keyword search (TODO: implement vector search for better results)
      for (const [id, doc] of this.documents) {
        // Filter by category if specified
        if (query.category && doc.category !== query.category) {
          continue;
        }

        // Check if document content matches search terms
        const contentLower = doc.content.toLowerCase();
        const matchCount = searchTerms.filter(term =>
          contentLower.includes(term) ||
          doc.metadata.title.toLowerCase().includes(term)
        ).length;

        if (matchCount > 0) {
          results.push({ ...doc });
        }
      }

      // Sort by relevance (simple: more matching terms = more relevant)
      results.sort((a, b) => {
        const scoreA = searchTerms.filter(term => a.content.toLowerCase().includes(term)).length;
        const scoreB = searchTerms.filter(term => b.content.toLowerCase().includes(term)).length;
        return scoreB - scoreA;
      });

      // Apply limit
      const limit = query.limit || 5;
      const limitedResults = results.slice(0, limit);

      return {
        chunks: limitedResults,
        totalResults: results.length
      };

    } catch (error) {
      throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Add document to knowledge base
   */
  addDocument(chunk: DocumentChunk): void {
    this.documents.set(chunk.id, chunk);
  }

  /**
   * Get document by ID
   */
  getDocument(id: string): DocumentChunk | undefined {
    return this.documents.get(id);
  }

  /**
   * Get all learning modules
   */
  getAllModules(): LearningModule[] {
    return Array.from(this.modules.values());
  }

  /**
   * Get module by ID
   */
  getModule(id: string): LearningModule | undefined {
    return this.modules.get(id);
  }

  /**
   * Get lessons for a module
   */
  getLessons(moduleId: string): Lesson[] {
    const module = this.modules.get(moduleId);
    return module ? module.lessons : [];
  }

  /**
   * Get specific lesson
   */
  getLesson(moduleId: string, lessonId: string): Lesson | undefined {
    const module = this.modules.get(moduleId);
    return module?.lessons.find(l => l.id === lessonId);
  }

  /**
   * Add learning module
   */
  addModule(module: LearningModule): void {
    this.modules.set(module.id, module);
  }

  /**
   * Initialize sample documentation and modules
   */
  private initializeSampleData(): void {
    // Sample documentation chunks
    this.addDocument({
      id: 'doc_001',
      content: 'Robot homing is the process of moving the robot to its zero position. This calibrates the robot and ensures accurate movement. To home the robot, use the command $H or the home button in the software.',
      source: 'WLKATA User Manual',
      category: 'setup',
      metadata: {
        title: 'Robot Homing Procedure',
        section: 'Getting Started'
      }
    });

    this.addDocument({
      id: 'doc_002',
      content: 'Coordinate mode allows you to move the robot by specifying X, Y, Z positions in millimeters. Joint mode controls individual joint angles. For beginners, coordinate mode is recommended.',
      source: 'WLKATA Programming Guide',
      category: 'programming',
      metadata: {
        title: 'Movement Modes',
        section: 'Robot Control'
      }
    });

    this.addDocument({
      id: 'doc_003',
      content: 'Error code 04 means the robot cannot reach the specified position. This usually happens when the target is outside the robot work envelope or when obstacles prevent movement.',
      source: 'WLKATA Troubleshooting Guide',
      category: 'troubleshooting',
      metadata: {
        title: 'Error Code 04',
        section: 'Common Errors'
      }
    });

    this.addDocument({
      id: 'doc_004',
      content: 'The gripper can be controlled using M3 commands. M3S40 closes the gripper, M3S10 opens it. You can adjust the values between 10-40 for different grip strengths.',
      source: 'WLKATA Hardware Manual',
      category: 'hardware',
      metadata: {
        title: 'Gripper Control',
        section: 'End Effectors'
      }
    });

    // Sample learning module
    const beginnerModule: LearningModule = {
      id: 'module_001',
      title: 'Introduction to WLKATA Robotics',
      description: 'Learn the basics of robot operation, coordinate systems, and simple movements',
      level: 'beginner',
      category: 'fundamentals',
      estimatedTime: 60,
      lessons: [
        {
          id: 'lesson_001',
          title: 'Robot Setup and Homing',
          description: 'Learn how to connect and calibrate your robot',
          content: 'In this lesson, you\'ll learn how to properly set up the WLKATA robot, connect it to your computer, and perform the critical homing procedure.',
          order: 1,
          codeExamples: [
            {
              language: 'python',
              code: `# Connect to robot
from wlkata import Robot

robot = Robot()
robot.connect('/dev/ttyUSB0')

# Home the robot
robot.home()
print("Robot is ready!")`,
              description: 'Basic robot connection and homing',
              runnable: true
            }
          ],
          exercises: [
            {
              id: 'ex_001',
              title: 'Home Your Robot',
              description: 'Connect to your robot and perform homing',
              task: 'Write code to connect to the robot and home it safely',
              difficulty: 'easy',
              hints: ['Make sure the robot has space to move', 'Always home before other movements']
            }
          ]
        },
        {
          id: 'lesson_002',
          title: 'Basic Movement',
          description: 'Learn coordinate systems and simple movements',
          content: 'Understanding how the robot moves is fundamental. The WLKATA uses a 3D coordinate system where you specify positions in millimeters.',
          order: 2,
          codeExamples: [
            {
              language: 'python',
              code: `# Move to a position
robot.move_to(x=100, y=150, z=200, speed=1000)

# Move with smooth interpolation
robot.linear_move(x=150, y=150, z=180)`,
              description: 'Moving the robot to specific coordinates',
              runnable: true
            }
          ]
        }
      ]
    };

    this.addModule(beginnerModule);

    // Advanced module example
    const advancedModule: LearningModule = {
      id: 'module_002',
      title: 'Vision and AI Integration',
      description: 'Learn to use machine vision with the robot for object detection and manipulation',
      level: 'advanced',
      category: 'vision',
      estimatedTime: 120,
      lessons: [
        {
          id: 'lesson_003',
          title: 'Color Detection',
          description: 'Detect and sort objects by color',
          content: 'Learn to integrate OpenCV with robot control for color-based object detection.',
          order: 1,
          codeExamples: [
            {
              language: 'python',
              code: `import cv2
import numpy as np

# Detect red objects
def detect_red(frame):
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    lower_red = np.array([0, 100, 100])
    upper_red = np.array([10, 255, 255])
    mask = cv2.inRange(hsv, lower_red, upper_red)
    return mask`,
              description: 'Color detection with OpenCV',
              runnable: false
            }
          ]
        }
      ]
    };

    this.addModule(advancedModule);
  }

  /**
   * Get recommendations based on user level
   */
  getRecommendedModules(userLevel: 'beginner' | 'intermediate' | 'advanced'): LearningModule[] {
    const allModules = this.getAllModules();
    return allModules.filter(m => m.level === userLevel);
  }
}

// Singleton instance
export const knowledgeService = new KnowledgeService();
