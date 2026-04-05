import { agents, n8nWorkflows, modelUsage, modelUsageTimeline } from '../data/dashboardData'
import { Bot, Zap, Play, Square, RotateCcw, ExternalLink } from 'lucide-react'
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function Agents() {
  const totalCost = modelUsage.reduce((sum, m) => sum + m.cost, 0)
  const totalTokens = modelUsage.reduce((sum, m) => sum + m.tokens, 0)

  return (
    <div className="space-y-6">
      {/* Agent Cards */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Active Agents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Bot className={`w-5 h-5 ${agent.status === 'running' ? 'text-green-500 animate-pulse' : agent.status === 'completed' ? 'text-blue-500' : 'text-gray-400'}`} />
                  <h4 className="text-sm font-semibold text-gray-900">{agent.name}</h4>
                </div>
                <AgentStatusBadge status={agent.status} />
              </div>
              <p className="text-xs text-gray-500 mb-3">{agent.task}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-gray-400">Runtime:</span> <span className="text-gray-700 font-medium">{agent.runtime}</span></div>
                <div><span className="text-gray-400">Model:</span> <span className="text-gray-700 font-medium">{agent.model}</span></div>
                <div><span className="text-gray-400">Tokens:</span> <span className="text-gray-700 font-medium">{((agent.tokensIn + agent.tokensOut) / 1000).toFixed(1)}k</span></div>
                <div><span className="text-gray-400">Cost:</span> <span className="text-gray-700 font-medium">£{agent.cost.toFixed(2)}</span></div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                {agent.status === 'running' && (
                  <button className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"><Square className="w-3 h-3" /> Stop</button>
                )}
                {agent.status === 'idle' && (
                  <button className="flex items-center gap-1 text-xs text-green-500 hover:text-green-600"><Play className="w-3 h-3" /> Start</button>
                )}
                {agent.status === 'completed' && (
                  <button className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600"><RotateCcw className="w-3 h-3" /> Rerun</button>
                )}
                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"><ExternalLink className="w-3 h-3" /> Logs</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* n8n Workflows */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">n8n Workflows</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Workflow</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Last Run</th>
                <th className="text-left px-4 py-3">24h Runs</th>
                <th className="text-left px-4 py-3">Success</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {n8nWorkflows.map((wf) => (
                <tr key={wf.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    {wf.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      wf.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>{wf.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{wf.lastRun}</td>
                  <td className="px-4 py-3 text-gray-700 font-medium">{wf.executions24h}</td>
                  <td className="px-4 py-3 text-green-600 font-medium">{wf.successRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Usage Charts */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Model Usage (Last 7 Days)</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Cost Breakdown Pie */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Cost by Model</h4>
            <p className="text-xs text-gray-400 mb-4">Total: £{totalCost.toFixed(2)}</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={modelUsage}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  dataKey="cost"
                  nameKey="model"
                  paddingAngle={3}
                >
                  {modelUsage.map((entry) => (
                    <Cell key={entry.model} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `£${value.toFixed(2)}`} />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Token Usage Over Time */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Token Usage Trend</h4>
            <p className="text-xs text-gray-400 mb-4">Total: {(totalTokens / 1000000).toFixed(1)}M tokens</p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={modelUsageTimeline}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}k`} />
                <Tooltip />
                <Area type="monotone" dataKey="claude-opus-4-6" stackId="1" stroke="#8b5cf6" fill="#8b5cf680" />
                <Area type="monotone" dataKey="claude-sonnet-4-6" stackId="1" stroke="#3b82f6" fill="#3b82f680" />
                <Area type="monotone" dataKey="grok-4-fast" stackId="1" stroke="#f97316" fill="#f9731680" />
                <Area type="monotone" dataKey="claude-haiku-4-5" stackId="1" stroke="#06b6d4" fill="#06b6d480" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

function AgentStatusBadge({ status }) {
  const map = {
    running: { label: 'Running', cls: 'bg-green-100 text-green-700' },
    completed: { label: 'Completed', cls: 'bg-blue-100 text-blue-700' },
    idle: { label: 'Idle', cls: 'bg-gray-100 text-gray-500' },
    error: { label: 'Error', cls: 'bg-red-100 text-red-700' },
  }
  const { label, cls } = map[status] || map.idle
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{label}</span>
}
