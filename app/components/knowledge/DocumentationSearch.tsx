'use client';

import { useState } from 'react';

interface DocumentChunk {
  id: string;
  content: string;
  source: string;
  category: string;
  metadata: {
    title: string;
    section?: string;
  };
}

export default function DocumentationSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DocumentChunk[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const categories = [
    { id: '', name: 'All Categories' },
    { id: 'setup', name: 'Setup & Installation' },
    { id: 'programming', name: 'Programming' },
    { id: 'troubleshooting', name: 'Troubleshooting' },
    { id: 'concepts', name: 'Robotics Concepts' },
    { id: 'hardware', name: 'Hardware' },
    { id: 'vision', name: 'Machine Vision' },
    { id: 'advanced', name: 'Advanced Topics' }
  ];

  const search = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch('/api/knowledge/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          category: selectedCategory || undefined,
          limit: 10
        })
      });

      const data = await res.json();
      if (data.success) {
        setResults(data.data.chunks);
      }
    } catch (error) {
      console.error('Search failed:', error);
    }

    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      search();
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      setup: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      programming: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      troubleshooting: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      concepts: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      hardware: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      vision: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      advanced: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    };
    return colors[category] || 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
  };

  const popularSearches = [
    'robot homing',
    'coordinate mode',
    'gripper control',
    'error codes',
    'movement commands',
    'safety guidelines'
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Documentation Search
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Search through WLKATA manuals, guides, and technical documentation
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <div className="flex space-x-3 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search documentation... (e.g., 'how to home robot')"
            className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={search}
            disabled={loading || !query.trim()}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {!searched && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-3">
              Popular Searches
            </h2>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(term);
                    setTimeout(search, 100);
                  }}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="text-3xl mb-2">📘</div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                User Manuals
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Complete guides for WLKATA robot setup and operation
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
              <div className="text-3xl mb-2">💻</div>
              <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
                Programming Guides
              </h3>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                Learn to control your robot with Python, JavaScript, and G-code
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
              <div className="text-3xl mb-2">🔧</div>
              <h3 className="font-semibold text-red-900 dark:text-red-300 mb-2">
                Troubleshooting
              </h3>
              <p className="text-sm text-red-800 dark:text-red-200">
                Solutions for common issues and error codes
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <div className="text-3xl mb-2">🎓</div>
              <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">
                Robotics Concepts
              </h3>
              <p className="text-sm text-green-800 dark:text-green-200">
                Understand kinematics, coordinate systems, and more
              </p>
            </div>
          </div>
        </div>
      )}

      {searched && (
        <div className="space-y-4">
          {results.length === 0 && !loading && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No results found
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Try different keywords or browse the categories above
              </p>
            </div>
          )}

          {results.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                    {doc.metadata.title}
                  </h3>
                  {doc.metadata.section && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                      {doc.metadata.section}
                    </p>
                  )}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(doc.category)}`}>
                  {doc.category}
                </span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-3">
                {doc.content}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Source: {doc.source}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
