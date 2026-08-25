'use client';

import { useState, useEffect } from 'react';

interface DashboardHomeProps {
  onNavigate: (tab: 'products' | 'ai' | 'learn' | 'docs') => void;
}

export default function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const [stats, setStats] = useState({ modules: 0, lessons: 0 });

  useEffect(() => {
    fetch('/api/knowledge/modules')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const modules = data.data || [];
          const totalLessons = modules.reduce((sum: number, mod: any) => sum + (mod.lessons?.length || 0), 0);
          setStats({ modules: modules.length, lessons: totalLessons });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-black border-2 border-green-500 rounded-lg p-8 md:p-12">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            WLKATA Learning Platform
          </h1>
          <p className="text-lg mb-6 text-slate-300">
            Structured robotics education combining interactive modules, AI-assisted learning, and hands-on robot control.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('learn')}
              className="px-5 py-2.5 bg-green-500 text-black rounded-md font-medium hover:bg-green-400 transition-colors"
            >
              View Learning Modules
            </button>
            <button
              onClick={() => onNavigate('products')}
              className="px-5 py-2.5 border border-green-500 text-green-500 rounded-md font-medium hover:bg-green-500 hover:text-black transition-colors"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 rounded-lg border border-slate-700 p-5">
          <p className="text-sm text-slate-400 mb-1">Learning Modules</p>
          <p className="text-3xl font-bold text-white">{stats.modules}</p>
        </div>

        <div className="bg-slate-900 rounded-lg border border-slate-700 p-5">
          <p className="text-sm text-slate-400 mb-1">Total Lessons</p>
          <p className="text-3xl font-bold text-white">{stats.lessons}</p>
        </div>

        <div className="bg-slate-900 rounded-lg border border-green-500 p-5">
          <p className="text-sm text-slate-400 mb-1">AI Assistant</p>
          <p className="text-3xl font-bold text-green-500">Active</p>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">
          Platform Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate('learn')}
            className="text-left bg-slate-900 rounded-lg border border-slate-700 p-5 hover:border-green-500 transition-colors"
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              Learning Modules
            </h3>
            <p className="text-sm text-slate-400 mb-3">
              Structured curriculum covering robotics fundamentals, kinematics, programming, and advanced control systems. Progress from basic concepts to complex automation projects.
            </p>
            <div className="text-sm text-green-500">
              View modules →
            </div>
          </button>

          <button
            onClick={() => onNavigate('ai')}
            className="text-left bg-slate-900 rounded-lg border border-slate-700 p-5 hover:border-green-500 transition-colors"
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              AI Assistant
            </h3>
            <p className="text-sm text-slate-400 mb-3">
              Get code examples, explanations, and debugging help. The assistant understands robotics concepts and can generate working code for WLKATA robots.
            </p>
            <div className="text-sm text-green-500">
              Open assistant →
            </div>
          </button>

          <button
            onClick={() => onNavigate('products')}
            className="text-left bg-slate-900 rounded-lg border border-slate-700 p-5 hover:border-green-500 transition-colors"
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              Product Catalog
            </h3>
            <p className="text-sm text-slate-400 mb-3">
              Compare WLKATA robot models, specifications, and pricing. Find the right hardware for educational institutions, research labs, or individual learning.
            </p>
            <div className="text-sm text-green-500">
              Browse products →
            </div>
          </button>

          <button
            onClick={() => onNavigate('docs')}
            className="text-left bg-slate-900 rounded-lg border border-slate-700 p-5 hover:border-green-500 transition-colors"
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              Documentation
            </h3>
            <p className="text-sm text-slate-400 mb-3">
              Search technical documentation, API references, setup guides, and troubleshooting resources. Semantic search powered by AI embeddings.
            </p>
            <div className="text-sm text-green-500">
              Search docs →
            </div>
          </button>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
        <h2 className="text-lg font-bold text-white mb-4">
          Getting Started
        </h2>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-500 text-black rounded flex items-center justify-center font-semibold text-sm flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-medium text-white">
                Select a learning module based on your skill level
              </h3>
              <p className="text-sm text-slate-400">
                Beginner modules cover basic robotics and programming. Advanced modules include ROS, computer vision, and automation.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-500 text-black rounded flex items-center justify-center font-semibold text-sm flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-medium text-white">
                Work through lessons with code examples
              </h3>
              <p className="text-sm text-slate-400">
                Each lesson includes theory, practical examples, and exercises. Code can be tested with simulated or real robots.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-500 text-black rounded flex items-center justify-center font-semibold text-sm flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-medium text-white">
                Use the AI assistant for questions and debugging
              </h3>
              <p className="text-sm text-slate-400">
                The assistant can explain concepts, generate code snippets, and help troubleshoot issues specific to WLKATA robots.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
