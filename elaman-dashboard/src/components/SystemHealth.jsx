import { systemServices } from '../data/dashboardData'
import { Activity, CheckCircle2, AlertTriangle, XCircle, RefreshCw, ExternalLink } from 'lucide-react'

export default function SystemHealth() {
  const online = systemServices.filter(s => s.status === 'online' || s.status === 'healthy').length
  const total = systemServices.length

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Services Online</p>
              <p className="text-2xl font-bold text-green-600">{online}/{total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Uptime</p>
              <p className="text-2xl font-bold text-blue-600">99.7%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Alerts</p>
              <p className="text-2xl font-bold text-amber-600">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {systemServices.map((service) => (
          <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <StatusIcon status={service.status} />
                <h4 className="text-sm font-semibold text-gray-900">{service.name}</h4>
              </div>
              <StatusBadge status={service.status} />
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">URL</span>
                <span className="text-gray-600 font-mono">{service.url}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Uptime (30d)</span>
                <span className="text-gray-700 font-medium">{service.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Check</span>
                <span className="text-gray-700">{service.lastCheck}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Details</span>
                <span className="text-gray-700">{service.details}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              <button className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600">
                <ExternalLink className="w-3 h-3" /> Open
              </button>
              <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
                <RefreshCw className="w-3 h-3" /> Check Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatusIcon({ status }) {
  if (status === 'online' || status === 'healthy') return <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
  if (status === 'degraded') return <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
  return <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
}

function StatusBadge({ status }) {
  const map = {
    online: { label: 'Online', cls: 'bg-green-100 text-green-700' },
    healthy: { label: 'Healthy', cls: 'bg-green-100 text-green-700' },
    degraded: { label: 'Degraded', cls: 'bg-amber-100 text-amber-700' },
    offline: { label: 'Offline', cls: 'bg-red-100 text-red-700' },
  }
  const { label, cls } = map[status] || { label: status, cls: 'bg-gray-100 text-gray-600' }
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{label}</span>
}
