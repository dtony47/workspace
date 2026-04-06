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
import { Building2, Menu, X } from 'lucide-react'

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
      {/* Mobile Menu Toggle - only visible on mobile */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-4 left-4 z-40 md:hidden p-2 bg-white rounded-lg shadow-lg"
      >
        {mobileMenuOpen ? (
          <X className="w-5 h-5 text-gray-700" />
        ) : (
          <Menu className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 z-30 h-full transition-transform duration-300 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(id) => {
            setActiveTab(id)
            setMobileMenuOpen(false)
          }}
        />
      </div>

      {/* Main Content */}
      <div className="md:ml-60 transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 sm:px-6 h-16 flex items-center justify-between ml-0 md:ml-0">
          <div className="ml-8 md:ml-0">
            <h1 className="text-lg font-semibold text-gray-900">{tabTitles[activeTab]}</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden sm:block text-xs text-gray-400">
              Elaman Executive Dashboard v1.0.0
            </span>
            <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-gray-500">Live</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6">
          {renderTab()}
        </main>
      </div>
    </div>
  )
}

export default App
