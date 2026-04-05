import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Overview from './components/Overview'
import Projects from './components/Projects'
import Tasks from './components/Tasks'
import Agents from './components/Agents'
import GitHub from './components/GitHub'
import Email from './components/Email'
import Financials from './components/Financials'
import SystemHealth from './components/SystemHealth'
import CalendarView from './components/CalendarView'
import SettingsView from './components/SettingsView'
import { Building2 } from 'lucide-react'

const tabTitles = {
  overview: 'Overview',
  projects: 'Projects',
  tasks: 'Tasks & Actions',
  agents: 'Agents & Automation',
  github: 'GitHub & PRs',
  email: 'Email & Communications',
  financials: 'Financials',
  health: 'System Health',
  calendar: 'Calendar & Events',
  settings: 'Settings',
}

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <Overview setActiveTab={setActiveTab} />
      case 'projects': return <Projects />
      case 'tasks': return <Tasks />
      case 'agents': return <Agents />
      case 'github': return <GitHub />
      case 'email': return <Email />
      case 'financials': return <Financials />
      case 'health': return <SystemHealth />
      case 'calendar': return <CalendarView />
      case 'settings': return <SettingsView />
      default: return <Overview setActiveTab={setActiveTab} />
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content - offset by sidebar width */}
      <div className="ml-60 transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{tabTitles[activeTab]}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">
              Elaman Executive Dashboard v1.0.0
            </span>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-gray-500">Live</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {renderTab()}
        </main>
      </div>
    </div>
  )
}

export default App
