import { useState } from 'react'
import { tasks as initialTasks } from '../data/dashboardData'
import { CheckCircle2, Circle, Clock, AlertCircle, GripVertical, Filter } from 'lucide-react'

export default function Tasks() {
  const [taskList, setTaskList] = useState(initialTasks)
  const [filterCategory, setFilterCategory] = useState('ALL')
  const [filterPriority, setFilterPriority] = useState('ALL')
  const [draggedId, setDraggedId] = useState(null)

  const categories = ['ALL', ...new Set(initialTasks.map(t => t.category))]

  const filtered = taskList.filter(t => {
    const matchCat = filterCategory === 'ALL' || t.category === filterCategory
    const matchPri = filterPriority === 'ALL' || t.priority === filterPriority
    return matchCat && matchPri
  })

  const toggleTask = (id) => {
    setTaskList(prev => prev.map(t =>
      t.id === id ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t
    ))
  }

  const handleDragStart = (e, id) => {
    setDraggedId(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, targetId) => {
    e.preventDefault()
    if (draggedId === targetId) return
    setTaskList(prev => {
      const items = [...prev]
      const dragIdx = items.findIndex(t => t.id === draggedId)
      const targetIdx = items.findIndex(t => t.id === targetId)
      const [dragged] = items.splice(dragIdx, 1)
      items.splice(targetIdx, 0, dragged)
      return items
    })
  }

  const handleDragEnd = () => setDraggedId(null)

  const pendingCount = filtered.filter(t => t.status === 'pending').length
  const doneCount = filtered.filter(t => t.status === 'done').length

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Tasks</p>
          <p className="text-2xl font-bold text-gray-900">{filtered.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">{doneCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500 font-medium">Category:</span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCategory(c)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filterCategory === c ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Priority:</span>
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
      </div>

      {/* Task List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
        {filtered.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => handleDragStart(e, task.id)}
            onDragOver={(e) => handleDragOver(e, task.id)}
            onDragEnd={handleDragEnd}
            className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-grab active:cursor-grabbing transition-colors ${
              draggedId === task.id ? 'opacity-50' : ''
            } ${task.status === 'done' ? 'opacity-60' : ''}`}
          >
            <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
            <button onClick={() => toggleTask(task.id)} className="shrink-0">
              {task.status === 'done' ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300 hover:text-blue-400" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-400">{task.category}</span>
                <span className="text-xs text-gray-300">|</span>
                <span className="text-xs text-gray-400">{task.source}</span>
              </div>
            </div>
            <PriorityBadge priority={task.priority} />
            <div className="flex items-center gap-1 shrink-0">
              {task.due === 'Today' ? (
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              ) : (
                <Clock className="w-3.5 h-3.5 text-gray-400" />
              )}
              <span className={`text-xs ${task.due === 'Today' ? 'text-red-500 font-medium' : 'text-gray-400'}`}>{task.due}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PriorityBadge({ priority }) {
  const colors = {
    HIGH: 'bg-red-100 text-red-700',
    MEDIUM: 'bg-amber-100 text-amber-700',
    LOW: 'bg-gray-100 text-gray-600',
  }
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${colors[priority]}`}>
      {priority}
    </span>
  )
}
