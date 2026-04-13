'use client';

import { useState } from 'react';
import RobotControlPanel from './components/robot/RobotControlPanel';
import AIChat from './components/ai/AIChat';
import LearningModules from './components/knowledge/LearningModules';
import DocumentationSearch from './components/knowledge/DocumentationSearch';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'robot' | 'ai' | 'learn' | 'docs'>('robot');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  WLKATA Learning Platform
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  AI-Powered Robotics Education
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                System Ready
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-2">
            <TabButton
              active={activeTab === 'robot'}
              onClick={() => setActiveTab('robot')}
              icon="🤖"
              label="Robot Control"
            />
            <TabButton
              active={activeTab === 'ai'}
              onClick={() => setActiveTab('ai')}
              icon="💬"
              label="AI Assistant"
            />
            <TabButton
              active={activeTab === 'learn'}
              onClick={() => setActiveTab('learn')}
              icon="📚"
              label="Learn"
            />
            <TabButton
              active={activeTab === 'docs'}
              onClick={() => setActiveTab('docs')}
              icon="📖"
              label="Documentation"
            />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'robot' && <RobotControlPanel />}
        {activeTab === 'ai' && <AIChat />}
        {activeTab === 'learn' && <LearningModules />}
        {activeTab === 'docs' && <DocumentationSearch />}
      </main>

      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            WLKATA Learning Platform - Built with Next.js and Claude AI
          </p>
        </div>
      </footer>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
        ${active
          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
        }
      `}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{label}</span>
    </button>
  );
}
