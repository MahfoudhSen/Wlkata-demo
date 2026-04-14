'use client';

import { useState, useEffect } from 'react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  order: number;
  codeExamples?: Array<{
    language: string;
    code: string;
    description: string;
  }>;
}

interface Module {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  estimatedTime: number;
  lessons: Lesson[];
}

export default function LearningModules() {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const res = await fetch('/api/knowledge/modules');
      const data = await res.json();
      if (data.success) {
        setModules(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch modules:', error);
    }
    setLoading(false);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
    }
  };

  if (selectedLesson && selectedModule) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setSelectedLesson(null)}
          className="mb-4 text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to {selectedModule.title}
        </button>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {selectedLesson.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {selectedLesson.description}
          </p>

          <div className="prose dark:prose-invert max-w-none mb-8">
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
              {selectedLesson.content}
            </p>
          </div>

          {selectedLesson.codeExamples && selectedLesson.codeExamples.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Code Examples
              </h2>
              {selectedLesson.codeExamples.map((example, idx) => (
                <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <div className="bg-slate-100 dark:bg-slate-700 px-4 py-2 border-b border-slate-200 dark:border-slate-600">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {example.description}
                    </p>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {example.language}
                    </span>
                  </div>
                  <div className="bg-slate-900 dark:bg-black p-4 overflow-x-auto">
                    <pre className="text-sm text-green-400 font-mono">{example.code}</pre>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex space-x-3">
            <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
              Mark as Complete
            </button>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              Try Exercise
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedModule) {
    return (
      <div>
        <button
          onClick={() => setSelectedModule(null)}
          className="mb-4 text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to all modules
        </button>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {selectedModule.title}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {selectedModule.description}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(selectedModule.level)}`}>
              {selectedModule.level}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
            <span>{selectedModule.lessons.length} lessons</span>
            <span>{selectedModule.estimatedTime} minutes</span>
          </div>
        </div>

        <div className="space-y-3">
          {selectedModule.lessons
            .sort((a, b) => a.order - b.order)
            .map((lesson, idx) => (
              <button
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
                className="w-full text-left bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {lesson.description}
                    </p>
                  </div>
                  <div className="text-slate-400">→</div>
                </div>
              </button>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Learning Modules
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Start your robotics journey with structured lessons and hands-on exercises
        </p>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading modules...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module) => (
            <div
              key={module.id}
              onClick={() => setSelectedModule(module)}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {module.title}
                </h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(module.level)}`}>
                  {module.level}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                {module.description}
              </p>
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>{module.lessons.length} lessons</span>
                <span>{module.estimatedTime} min</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
