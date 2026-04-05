import { projects, tasks, priorityEmails, agents, financials } from '../data/dashboardData'
import {
  TrendingUp, Mail, Bot, PoundSterling, AlertCircle, Zap,
  CheckCircle2, Clock, ArrowUpRight
} from 'lucide-react'

export default function Overview({ setActiveTab }) {
  const activeProjects = projects.filter(p => p.status === 'active')
  const runningAgents = agents.filter(a => a.status === 'running')
  const unreadEmails = priorityEmails.filter(e => !e.read)
  const todayTasks = tasks.filter(t => t.due === 'Today')
  const todayCost = agents.reduce((sum, a) => sum + a.cost, 0)

  return (
    <div className="space-y-6">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Projects"
          value={activeProjects.length}
          subtitle={`${projects.length} total`}
          icon={TrendingUp}
          color="blue"
          onClick={() => setActiveTab('projects')}
        />
        <MetricCard
          title="Priority Emails"
          value={unreadEmails.length}
          subtitle={`${priorityEmails.length} total`}
          icon={Mail}
          color="red"
          onClick={() => setActiveTab('email')}
        />
        <MetricCard
          title="Active Agents"
          value={runningAgents.length}
          subtitle={`${agents.length} total`}
          icon={Bot}
          color="purple"
          onClick={() => setActiveTab('agents')}
        />
        <MetricCard
          title="Today's Costs"
          value={`£${todayCost.toFixed(2)}`}
          subtitle="API/Model usage"
          icon={PoundSterling}
          color="amber"
          onClick={() => setActiveTab('financials')}
        />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* MRR Tracker */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">MRR Tracker</h3>
            <span className="text-xs text-gray-500">Monthly Recurring Revenue</span>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-bold text-green-600">£{financials.mrr.current.toLocaleString()}</span>
            <span className="text-sm text-gray-500">/ £{financials.mrr.target.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${(financials.mrr.current / financials.mrr.target) * 100}%` }}
            />
          </div>
          <div className="space-y-1.5">
            {financials.mrr.breakdown.map((item) => (
              <div key={item.project} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.project}</span>
                </div>
                <span className="font-medium">£{item.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Project Health */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Project Health</h3>
            <button onClick={() => setActiveTab('projects')} className="text-xs text-blue-500 hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {projects.slice(0, 6).map((project) => (
              <div key={project.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <StatusDot status={project.status} />
                  <span className="text-sm text-gray-700 truncate">{project.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-16 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">{project.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <ActionButton icon={Mail} label="Run Email Check" color="bg-blue-500 hover:bg-blue-600" />
            <ActionButton icon={Zap} label="Generate Daily Brief" color="bg-green-500 hover:bg-green-600" />
            <ActionButton icon={Bot} label="Spawn Agent" color="bg-purple-500 hover:bg-purple-600" />
            <ActionButton icon={TrendingUp} label="Sync Projects" color="bg-amber-500 hover:bg-amber-600" />
          </div>
        </div>
      </div>

      {/* Active Sprints Row */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Active Sprints</h3>
            <p className="text-xs text-gray-500 mt-0.5">Live project status</p>
          </div>
          <button onClick={() => setActiveTab('projects')} className="text-xs text-blue-500 hover:underline flex items-center gap-1">
            Full Dashboard <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.filter(p => ['active', 'ready'].includes(p.status)).slice(0, 3).map((project) => (
            <div key={project.id} className="border border-gray-100 rounded-lg p-4 hover:border-blue-200 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StatusDot status={project.status} />
                  <span className="font-medium text-sm text-gray-900">{project.name}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{project.progress}%</span>
              </div>
              <p className="text-xs text-gray-500 mb-2 line-clamp-2">{project.statusLabel}</p>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              {project.notes && (
                <p className="text-xs text-gray-400 line-clamp-2">{project.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Priorities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Top Priorities</h3>
            <button onClick={() => setActiveTab('tasks')} className="text-xs text-blue-500 hover:underline flex items-center gap-1">
              All Tasks <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {todayTasks.slice(0, 5).map((task) => (
              <label key={task.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-700">{task.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <PriorityBadge priority={task.priority} />
                    <span className="text-xs text-gray-400">{task.category}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Priority Inbox Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Priority Inbox</h3>
            <button onClick={() => setActiveTab('email')} className="text-xs text-blue-500 hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {priorityEmails.slice(0, 4).map((email) => (
              <div key={email.id} className={`p-3 rounded-lg border ${email.read ? 'border-gray-100 bg-gray-50' : 'border-blue-100 bg-blue-50/50'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{email.from}</span>
                  <span className="text-xs text-gray-400">{email.received}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{email.subject}</p>
                <div className="flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 text-amber-500" />
                  <span className="text-xs text-gray-400">{email.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, subtitle, icon: Icon, color, onClick }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
    green: 'bg-green-50 text-green-600',
  }
  return (
    <button onClick={onClick} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-left hover:shadow-md transition-shadow w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">{title}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </button>
  )
}

function ActionButton({ icon: Icon, label, color }) {
  return (
    <button className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium transition-colors ${color}`}>
      <Icon className="w-4 h-4" />
      {label}
    </button>
  )
}

function StatusDot({ status }) {
  const colors = {
    active: 'bg-green-500',
    ready: 'bg-yellow-500',
    planning: 'bg-yellow-500',
    'not-started': 'bg-gray-400',
  }
  return <div className={`w-2 h-2 rounded-full shrink-0 ${colors[status] || 'bg-gray-400'}`} />
}

function PriorityBadge({ priority }) {
  const colors = {
    HIGH: 'bg-red-100 text-red-700',
    MEDIUM: 'bg-amber-100 text-amber-700',
    LOW: 'bg-gray-100 text-gray-600',
  }
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${colors[priority]}`}>
      {priority}
    </span>
  )
}
