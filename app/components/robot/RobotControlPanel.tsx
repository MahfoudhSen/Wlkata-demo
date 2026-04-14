'use client';

import { useState, useEffect } from 'react';

export default function ProductPanel() {

  useEffect(() => {
  }, []);








  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Products
          </h2>
        </div>



      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Emergency Controls
          </h2>
          <button
            // onClick={stopRobot}
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
          >
            EMERGENCY STOP
          </button>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Immediately halts all robot movement
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Robot Visualization
          </h2>
          <div className="aspect-square bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
            <div className="text-center text-slate-400">
              <div className="text-4xl mb-2">🤖</div>
              <p className="text-sm">3D View Coming Soon</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
            Safety Tips
          </h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>Always home robot before movements</li>
            <li>Keep work area clear</li>
            <li>Use appropriate speeds</li>
            <li>Monitor robot at all times</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatusItem({ label, value, status }: { label: string; value: string; status?: boolean }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className={`text-sm font-semibold ${
        status !== undefined
          ? status
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400'
          : 'text-slate-900 dark:text-white'
      }`}>
        {value}
      </p>
    </div>
  );
}
