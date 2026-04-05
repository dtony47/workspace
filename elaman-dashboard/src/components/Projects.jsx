import { useState } from 'react'
import { projects } from '../data/dashboardData'
import { Search, Filter, LayoutGrid, List } from 'lucide-react'

const statusColumns = [
  { key: 'not-started', label: 'Not Started', color: 'border-gray-300' },
  { key: 'planning', label: 'Planning', color: 'border-yellow-400' },
  { key: 'ready', label: 'Ready', color: 'border-blue-400' },
  { key: 'active', label: 'Active', color: 'border-green-400' },
]

export default function Projects() {
  const [view, setView] = useState('kanban')
  const [search, setSearch] = useState('')
  const [filterPriority, setFilterPriority] = useState('ALL')

  const filtered = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesPriority = filterPriority === 'ALL' || p.priority === filterPriority
    return matchesSearch && matchesPriority
  })

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filterPriority === p ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          <button onClick={() => setView('kanban')} className={`p-2 ${view === 'kanban' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-400'}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button onClick={() => setView('list')} className={`p-2 ${view === 'list' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-400'}`}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Kanban View */}
      {view === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {statusColumns.map((col) => {
            const colProjects = filtered.filter(p => {
              if (col.key === 'not-started') return p.status === 'not-started'
              if (col.key === 'planning') return p.status === 'planning'
              if (col.key === 'ready') return p.status === 'ready'
              if (col.key === 'active') return p.status === 'active'
              return false
            })
            return (
              <div key={col.key} className="space-y-3">
                <div className={`flex items-center gap-2 px-1 pb-2 border-b-2 ${col.color}`}>
                  <h3 className="text-sm font-semibold text-gray-700">{col.label}</h3>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{colProjects.length}</span>
                </div>
                {colProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )
          })}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Project</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Priority</th>
                <th className="text-left px-4 py-3">Progress</th>
                <th className="text-left px-4 py-3">Sector</th>
                <th className="text-left px-4 py-3">Next Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} label={p.statusLabel} /></td>
                  <td className="px-4 py-3"><PriorityBadge priority={p.priority} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-100 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.sector}</td>
                  <td className="px-4 py-3 text-gray-500 truncate max-w-[200px]">{p.nextAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function ProjectCard({ project }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-900 leading-tight">{project.name}</h4>
        <PriorityBadge priority={project.priority} />
      </div>
      <p className="text-xs text-gray-500 mb-3">{project.description}</p>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${project.progress}%` }} />
        </div>
        <span className="text-xs text-gray-500">{project.progress}%</span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">{project.sector}</span>
        <span className="text-gray-400">{project.owner}</span>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-500">Next: {project.nextAction}</p>
      </div>
    </div>
  )
}

function StatusBadge({ status, label }) {
  const colors = {
    active: 'bg-green-100 text-green-700',
    ready: 'bg-blue-100 text-blue-700',
    planning: 'bg-yellow-100 text-yellow-700',
    'not-started': 'bg-gray-100 text-gray-600',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {label}
    </span>
  )
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
