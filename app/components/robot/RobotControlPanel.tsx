'use client';

import { useState, useEffect } from 'react';

interface RobotStatus {
  connected: boolean;
  homed: boolean;
  mode: 'idle' | 'joint' | 'coordinate';
  currentPosition: { x: number; y: number; z: number };
  jointAngles: { joint1: number; joint2: number; joint3: number; joint4: number };
}

export default function RobotControlPanel() {
  const [status, setStatus] = useState<RobotStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [position, setPosition] = useState({ x: 100, y: 150, z: 200 });

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/robot/status');
      const data = await res.json();
      if (data.success) {
        setStatus(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch status:', error);
    }
  };

  const connect = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/robot/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ port: '/dev/ttyUSB0' })
      });
      const data = await res.json();
      setMessage(data.message);
      await fetchStatus();
    } catch (error) {
      setMessage('Connection failed');
    }
    setLoading(false);
  };

  const homeRobot = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/robot/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'home' })
      });
      const data = await res.json();
      setMessage(data.message);
      await fetchStatus();
    } catch (error) {
      setMessage('Homing failed');
    }
    setLoading(false);
  };

  const moveToPosition = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/robot/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'move',
          position,
          speed: 1000
        })
      });
      const data = await res.json();
      setMessage(data.message);
      await fetchStatus();
    } catch (error) {
      setMessage('Movement failed');
    }
    setLoading(false);
  };

  const controlGripper = async (action: 'grip' | 'release') => {
    setLoading(true);
    try {
      const res = await fetch('/api/robot/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: action })
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Gripper control failed');
    }
    setLoading(false);
  };

  const stopRobot = async () => {
    try {
      const res = await fetch('/api/robot/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'stop' })
      });
      const data = await res.json();
      setMessage(data.message);
      await fetchStatus();
    } catch (error) {
      setMessage('Stop failed');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Robot Status
          </h2>
          {status ? (
            <div className="grid grid-cols-2 gap-4">
              <StatusItem label="Connection" value={status.connected ? 'Connected' : 'Disconnected'} status={status.connected} />
              <StatusItem label="Homed" value={status.homed ? 'Yes' : 'No'} status={status.homed} />
              <StatusItem label="Mode" value={status.mode.toUpperCase()} />
              <StatusItem label="Position" value={`X:${status.currentPosition.x} Y:${status.currentPosition.y} Z:${status.currentPosition.z}`} />
            </div>
          ) : (
            <p className="text-slate-500">Loading status...</p>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Position Control
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  X (mm)
                </label>
                <input
                  type="number"
                  value={position.x}
                  onChange={(e) => setPosition({ ...position, x: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Y (mm)
                </label>
                <input
                  type="number"
                  value={position.y}
                  onChange={(e) => setPosition({ ...position, y: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Z (mm)
                </label>
                <input
                  type="number"
                  value={position.z}
                  onChange={(e) => setPosition({ ...position, z: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <button
              onClick={moveToPosition}
              disabled={loading || !status?.connected}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors"
            >
              {loading ? 'Moving...' : 'Move to Position'}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={connect}
              disabled={loading || status?.connected}
              className="px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors"
            >
              Connect
            </button>
            <button
              onClick={homeRobot}
              disabled={loading || !status?.connected}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors"
            >
              Home Robot
            </button>
            <button
              onClick={() => controlGripper('grip')}
              disabled={loading || !status?.connected}
              className="px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors"
            >
              Close Gripper
            </button>
            <button
              onClick={() => controlGripper('release')}
              disabled={loading || !status?.connected}
              className="px-4 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors"
            >
              Open Gripper
            </button>
          </div>
        </div>

        {message && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">{message}</p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Emergency Controls
          </h2>
          <button
            onClick={stopRobot}
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
            <li>✓ Always home robot before movements</li>
            <li>✓ Keep work area clear</li>
            <li>✓ Use appropriate speeds</li>
            <li>✓ Monitor robot at all times</li>
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
