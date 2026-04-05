import { useState } from 'react'
import {
  LayoutDashboard, FolderKanban, CheckSquare, Bot, GitPullRequest,
  Mail, DollarSign, Activity, Calendar, Settings, ChevronLeft, ChevronRight,
  Building2
} from 'lucide-react'

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'agents', label: 'Agents', icon: Bot },
  { id: 'github', label: 'GitHub & PRs', icon: GitPullRequest },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'financials', label: 'Financials', icon: DollarSign },
  { id: 'health', label: 'System Health', icon: Activity },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ activeTab, setActiveTab }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-30 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
      style={{ backgroundColor: '#1a1a2e' }}
    >
      {/* Header */}
      <div className="flex items-center h-16 px-4 border-b border-white/10">
        <Building2 className="w-7 h-7 text-blue-400 shrink-0" />
        {!collapsed && (
          <span className="ml-3 text-white font-semibold text-sm truncate">
            Elaman Executive
          </span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border-r-2 border-blue-400'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="ml-3 truncate">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-white/10 text-gray-400 hover:text-white transition-colors"
      >
        {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>
    </aside>
  )
}

export { navItems }
