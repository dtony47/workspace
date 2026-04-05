import { useState } from 'react'
import { Sun, Moon, CheckCircle2, XCircle, ExternalLink, Shield, Bell } from 'lucide-react'

const integrations = [
  { name: 'Gmail API', status: 'connected', description: 'Priority email monitoring' },
  { name: 'GitHub API', status: 'connected', description: 'PR and commit tracking' },
  { name: 'Google Calendar', status: 'pending', description: 'Calendar sync' },
  { name: 'n8n API', status: 'pending', description: 'Workflow monitoring' },
  { name: 'Ollama API', status: 'connected', description: 'Local LLM models' },
  { name: 'Stripe API', status: 'not-configured', description: 'Revenue tracking' },
]

export default function SettingsView() {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState('30')

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Theme */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Appearance</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon className="w-5 h-5 text-blue-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
            <div>
              <p className="text-sm text-gray-700">Dark Mode</p>
              <p className="text-xs text-gray-400">Toggle dark theme for the dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-11 h-6 rounded-full transition-colors ${darkMode ? 'bg-blue-500' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${darkMode ? 'left-5.5 translate-x-0.5' : 'left-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-700">Desktop Notifications</p>
                <p className="text-xs text-gray-400">Get alerts for priority emails and PR updates</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative w-11 h-6 rounded-full transition-colors ${notifications ? 'bg-blue-500' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${notifications ? 'left-5.5 translate-x-0.5' : 'left-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Auto-Refresh Interval</p>
              <p className="text-xs text-gray-400">How often to refresh data from APIs</p>
            </div>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="10">10 seconds</option>
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
              <option value="300">5 minutes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Integrations</h3>
        <div className="space-y-3">
          {integrations.map((int) => (
            <div key={int.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <IntegrationStatusIcon status={int.status} />
                <div>
                  <p className="text-sm font-medium text-gray-700">{int.name}</p>
                  <p className="text-xs text-gray-400">{int.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IntegrationBadge status={int.status} />
                {int.status !== 'connected' && (
                  <button className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" /> Configure
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Security</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-green-600">
            <Shield className="w-4 h-4" />
            <span>Local access only (localhost:5173)</span>
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <Shield className="w-4 h-4" />
            <span>No cloud exposure</span>
          </div>
          <div className="flex items-center gap-2 text-amber-600">
            <Shield className="w-4 h-4" />
            <span>6 credentials need migration to Keychain</span>
          </div>
        </div>
      </div>

      {/* Version Info */}
      <div className="text-center text-xs text-gray-400 py-4">
        Elaman Executive Dashboard v1.0.0 | Built with React + Vite + Tailwind CSS
      </div>
    </div>
  )
}

function IntegrationStatusIcon({ status }) {
  if (status === 'connected') return <CheckCircle2 className="w-5 h-5 text-green-500" />
  if (status === 'pending') return <div className="w-5 h-5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
  return <XCircle className="w-5 h-5 text-gray-400" />
}

function IntegrationBadge({ status }) {
  const map = {
    connected: { label: 'Connected', cls: 'bg-green-100 text-green-700' },
    pending: { label: 'Pending', cls: 'bg-amber-100 text-amber-700' },
    'not-configured': { label: 'Not Configured', cls: 'bg-gray-100 text-gray-500' },
  }
  const { label, cls } = map[status] || map['not-configured']
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{label}</span>
}
