'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  code?: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your WLKATA robotics teaching assistant. I can help you learn robotics, generate code for the robot, explain concepts, and debug programs. What would you like to learn today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationId,
          context: { userLevel: 'beginner' }
        })
      });

      const data = await res.json();
      if (data.success) {
        setConversationId(data.data.conversationId);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.data.message,
          code: data.data.codeGenerated
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please make sure the ANTHROPIC_API_KEY is set in your .env file.'
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Failed to get response. Please check your connection and API key.'
      }]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "How do I move the robot to home position?",
    "Explain coordinate vs joint mode",
    "Generate code to pick up an object",
    "What are the safety guidelines?"
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-16rem)]">
      <div className="lg:col-span-3 flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            AI Teaching Assistant
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Ask anything about robotics, get code examples, or debug your programs
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                }`}
              >
                <div className="flex items-start space-x-2 mb-2">
                  <span className="font-semibold text-sm">
                    {msg.role === 'user' ? 'You' : 'AI Assistant'}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                {msg.code && (
                  <div className="mt-3 bg-slate-900 dark:bg-black rounded-lg p-3 overflow-x-auto">
                    <pre className="text-xs text-green-400 font-mono">{msg.code}</pre>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex space-x-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about robotics..."
              rows={2}
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg resize-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors"
            >
              Send
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
            Quick Questions
          </h3>
          <div className="space-y-2">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setInput(q)}
                className="w-full text-left px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
            What I Can Help With
          </h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>Explain robotics concepts</li>
            <li>Generate robot code</li>
            <li>Debug your programs</li>
            <li>Guide through lessons</li>
            <li>Answer any questions</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            Pro Tip
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            The more specific your question, the better I can help! Include details about what you&apos;re trying to achieve.
          </p>
        </div>
      </div>
    </div>
  );
}
