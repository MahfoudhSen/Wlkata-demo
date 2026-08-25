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
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newLevel, setNewLevel] = useState<Module['level']>('beginner');
  const [newEstimatedTime, setNewEstimatedTime] = useState<number>(15);

  async function fetchModules() {
    try {
      const res = await fetch('/api/knowledge/modules');
      const data = await res.json();
      if (data && data.success) {
        setModules(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch modules:', err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchModules();
  }, []);

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = {
        title: newTitle,
        description: newDescription,
        level: newLevel,
        estimatedTime: newEstimatedTime,
        category: 'general',
      };

      const res = await fetch('/api/knowledge/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data && data.success) {
        setShowAddForm(false);
        setNewTitle('');
        setNewDescription('');
        setNewLevel('beginner');
        setNewEstimatedTime(15);
        await fetchModules();
      } else {
        console.error('Failed to add module', data);
      }
    } catch (err) {
      console.error('Error adding module:', err);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/20 text-green-500 border border-green-500';
      case 'intermediate': return 'bg-slate-500/20 text-slate-300 border border-slate-500';
      case 'advanced': return 'bg-slate-700/20 text-slate-400 border border-slate-700';
      default: return 'bg-slate-700/20 text-slate-400 border border-slate-700';
    }
  };

  if (selectedLesson && selectedModule) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setSelectedLesson(null)}
          className="mb-4 text-green-500 hover:text-green-400"
        >
          ← Back to {selectedModule.title}
        </button>

        <div className="bg-slate-900 rounded-lg border border-slate-700 p-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            {selectedLesson.title}
          </h1>
          <p className="text-slate-400 mb-6">
            {selectedLesson.description}
          </p>

          <div className="max-w-none mb-8">
            <p className="text-slate-300 whitespace-pre-wrap">
              {selectedLesson.content}
            </p>
          </div>

          {selectedLesson.codeExamples && selectedLesson.codeExamples.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                Code Examples
              </h2>
              {selectedLesson.codeExamples.map((example, idx) => (
                <div key={idx} className="border border-slate-700 rounded-lg overflow-hidden">
                  <div className="bg-slate-800 px-4 py-2 border-b border-slate-700">
                    <p className="text-sm font-medium text-slate-300">
                      {example.description}
                    </p>
                    <span className="text-xs text-slate-400">
                      {example.language}
                    </span>
                  </div>
                  <div className="bg-black p-4 overflow-x-auto">
                    <pre className="text-sm text-green-400 font-mono">{example.code}</pre>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex space-x-3">
            <button className="px-6 py-2 bg-green-500 hover:bg-green-400 text-black rounded font-medium transition-colors">
              Mark as Complete
            </button>
            <button className="px-6 py-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black rounded font-medium transition-colors">
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
          className="mb-4 text-green-500 hover:text-green-400"
        >
          ← Back to all modules
        </button>

        <div className="bg-slate-900 rounded-lg border border-slate-700 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {selectedModule.title}
              </h1>
              <p className="text-slate-400">
                {selectedModule.description}
              </p>
            </div>
            <span className={`px-3 py-1 rounded text-xs font-medium ${getLevelColor(selectedModule.level)}`}>
              {selectedModule.level}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-slate-400">
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
                className="w-full text-left bg-slate-900 rounded-lg border border-slate-700 p-6 hover:border-green-500 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500/20 border border-green-500 text-green-500 rounded flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {lesson.description}
                    </p>
                  </div>
                  <div className="text-green-500">→</div>
                </div>
              </button>
            ))}
        </div>
      </div>
    );
  }

  const modulesByLevel = {
    beginner: modules.filter(m => m.level === 'beginner'),
    intermediate: modules.filter(m => m.level === 'intermediate'),
    advanced: modules.filter(m => m.level === 'advanced')
  };

  return (
    <div>
      {/* Learning Pathway Visualization */}
      <div className="mb-8 bg-black border-2 border-green-500 rounded-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-3 text-white">
          Your Learning Journey
        </h1>
        <p className="text-lg text-slate-300 mb-6">
          Follow a structured path from foundational concepts to advanced robotics
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center font-bold text-black">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Beginner</h3>
                <p className="text-sm text-slate-400">{modulesByLevel.beginner.length} modules</p>
              </div>
            </div>
            <p className="text-sm text-slate-300">
              Start here! Learn the basics of robotics, programming, and control systems.
            </p>
          </div>

          <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-slate-500 rounded flex items-center justify-center font-bold text-white">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Intermediate</h3>
                <p className="text-sm text-slate-400">{modulesByLevel.intermediate.length} modules</p>
              </div>
            </div>
            <p className="text-sm text-slate-300">
              Build on fundamentals with advanced programming and practical projects.
            </p>
          </div>

          <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-slate-700 rounded flex items-center justify-center font-bold text-white">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Advanced</h3>
                <p className="text-sm text-slate-400">{modulesByLevel.advanced.length} modules</p>
              </div>
            </div>
            <p className="text-sm text-slate-300">
              Master complex topics like AI integration, automation, and research.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              All Learning Modules
            </h2>
            <p className="text-sm text-slate-400">
              Choose a module to begin your learning journey
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(v => !v)}
            className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black rounded text-sm font-medium"
          >
            {showAddForm ? 'Cancel' : 'Add Module'}
          </button>
        </div>
        {showAddForm && (
          <form onSubmit={handleAddModule} className="mt-4 space-y-3 bg-slate-900 p-4 rounded-lg border border-slate-700">
            <div>
              <label className="block text-sm font-medium text-slate-300">Title</label>
              <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} className="mt-1 w-full px-3 py-2 border border-slate-700 rounded bg-black text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Description</label>
              <textarea required value={newDescription} onChange={e => setNewDescription(e.target.value)} className="mt-1 w-full px-3 py-2 border border-slate-700 rounded bg-black text-white" />
            </div>
            <div className="flex space-x-3">
              <div>
                <label className="block text-sm font-medium text-slate-300">Level</label>
                <select value={newLevel} onChange={e => setNewLevel(e.target.value as Module['level'])} className="mt-1 px-3 py-2 border border-slate-700 rounded bg-black text-white">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">Estimated minutes</label>
                <input type="number" value={newEstimatedTime} onChange={e => setNewEstimatedTime(Number(e.target.value))} className="mt-1 px-3 py-2 border border-slate-700 rounded bg-black text-white w-32" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button type="submit" className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black rounded">Create</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded">Cancel</button>
            </div>
          </form>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Loading modules...</p>
        </div>
      ) : modules.length === 0 ? (
        <div className="bg-slate-900 rounded-lg border border-slate-700 p-12 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">
            No Modules Yet
          </h3>
          <p className="text-slate-400 mb-6">
            Get started by adding your first learning module
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-green-500 hover:bg-green-400 text-black rounded font-medium"
          >
            Create First Module
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Beginner Modules */}
          {modulesByLevel.beginner.length > 0 && (
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-black font-bold text-sm">
                  1
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Beginner Level
                </h3>
                <span className="px-3 py-1 bg-green-500/20 border border-green-500 text-green-500 rounded text-sm font-medium">
                  Start Here
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modulesByLevel.beginner.map((module) => (
                  <ModuleCard key={module.id} module={module} onClick={() => setSelectedModule(module)} getLevelColor={getLevelColor} />
                ))}
              </div>
            </div>
          )}

          {/* Intermediate Modules */}
          {modulesByLevel.intermediate.length > 0 && (
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-slate-500 rounded flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Intermediate Level
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modulesByLevel.intermediate.map((module) => (
                  <ModuleCard key={module.id} module={module} onClick={() => setSelectedModule(module)} getLevelColor={getLevelColor} />
                ))}
              </div>
            </div>
          )}

          {/* Advanced Modules */}
          {modulesByLevel.advanced.length > 0 && (
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-slate-700 rounded flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Advanced Level
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modulesByLevel.advanced.map((module) => (
                  <ModuleCard key={module.id} module={module} onClick={() => setSelectedModule(module)} getLevelColor={getLevelColor} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ModuleCard({
  module,
  onClick,
  getLevelColor
}: {
  module: Module;
  onClick: () => void;
  getLevelColor: (level: string) => string;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-slate-900 rounded-lg border border-slate-700 p-6 cursor-pointer hover:border-green-500 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-white group-hover:text-green-500 transition-colors">
          {module.title}
        </h3>
        <span className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${getLevelColor(module.level)}`}>
          {module.level}
        </span>
      </div>
      <p className="text-slate-400 mb-4 line-clamp-2 text-sm">
        {module.description}
      </p>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4 text-slate-400">
          <span>{module.lessons.length} lessons</span>
          <span>{module.estimatedTime} min</span>
        </div>
        <span className="text-green-500 group-hover:translate-x-1 transition-transform">
          →
        </span>
      </div>
    </div>
  );
}
