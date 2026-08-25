'use client';

import { useState } from 'react';
import DashboardHome from './components/home/DashboardHome';
import ProductPanel from './components/robot/RobotControlPanel';
import AIChat from './components/ai/AIChat';
import LearningModules from './components/knowledge/LearningModules';
import DocumentationSearch from './components/knowledge/DocumentationSearch';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'home' | 'products' | 'ai' | 'learn' | 'docs'>('home');

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center">
                <span className="text-black font-bold text-xl">W</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  WLKATA Learning Platform
                </h1>
                <p className="text-xs text-slate-400">
                  Robotics Education System
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1 bg-green-500/10 border border-green-500 text-green-500 rounded text-sm font-medium">
                System Active
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-2">
            <TabButton
              active={activeTab === 'home'}
              onClick={() => setActiveTab('home')}
              label="Home"
            />
            <TabButton
              active={activeTab === 'learn'}
              onClick={() => setActiveTab('learn')}
              label="Learning"
            />
            <TabButton
              active={activeTab === 'ai'}
              onClick={() => setActiveTab('ai')}
              label="AI Assistant"
            />
            <TabButton
              active={activeTab === 'products'}
              onClick={() => setActiveTab('products')}
              label="Products"
            />
            <TabButton
              active={activeTab === 'docs'}
              onClick={() => setActiveTab('docs')}
              label="Documentation"
            />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && <DashboardHome onNavigate={setActiveTab} />}
        {activeTab === 'learn' && <LearningModules />}
        {activeTab === 'ai' && <AIChat />}
        {activeTab === 'products' && <ProductPanel />}
        {activeTab === 'docs' && <DocumentationSearch />}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-slate-400">
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
  label
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded font-medium transition-all text-sm
        ${active
          ? 'bg-green-500 text-black'
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }
      `}
    >
      {label}
    </button>
  );
}
