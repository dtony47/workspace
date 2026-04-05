import { calendarEvents } from '../data/dashboardData'
import { Clock, CheckCircle2, Calendar, Coffee, Brain, Briefcase, RotateCcw } from 'lucide-react'

const typeConfig = {
  routine: { icon: RotateCcw, color: 'bg-gray-100 text-gray-600', border: 'border-gray-200' },
  meeting: { icon: Briefcase, color: 'bg-blue-100 text-blue-600', border: 'border-blue-200' },
  focus: { icon: Brain, color: 'bg-purple-100 text-purple-600', border: 'border-purple-200' },
  break: { icon: Coffee, color: 'bg-green-100 text-green-600', border: 'border-green-200' },
  task: { icon: CheckCircle2, color: 'bg-amber-100 text-amber-600', border: 'border-amber-200' },
}

export default function CalendarView() {
  const now = new Date()
  const currentHour = now.getHours()

  return (
    <div className="space-y-6">
      {/* Today Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Sunday, 5 April 2026
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">Manchester, UK | +6C, Light Rain</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-500">{calendarEvents.length} events today</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {calendarEvents.map((event) => {
          const config = typeConfig[event.type] || typeConfig.routine
          const Icon = config.icon
          const startHour = parseInt(event.time.split(':')[0])
          const isPast = event.status === 'completed'
          const isCurrent = startHour === currentHour

          return (
            <div
              key={event.id}
              className={`bg-white rounded-xl shadow-sm border p-4 flex items-start gap-4 transition-all ${
                isPast ? 'opacity-60 border-gray-100' : isCurrent ? `border-2 ${config.border}` : 'border-gray-200'
              }`}
            >
              {/* Time */}
              <div className="w-28 shrink-0 text-right">
                <span className={`text-sm font-mono ${isPast ? 'text-gray-400' : 'text-gray-700 font-medium'}`}>
                  {event.time}
                </span>
              </div>

              {/* Icon */}
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}>
                <Icon className="w-4 h-4" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className={`text-sm font-semibold ${isPast ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                    {event.title}
                  </h4>
                  {isPast && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  {isCurrent && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">Now</span>}
                </div>
                <span className={`text-xs capitalize ${isPast ? 'text-gray-300' : 'text-gray-400'}`}>{event.type}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Calendar Integration Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <Clock className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-800">Google Calendar integration pending</p>
          <p className="text-xs text-amber-600 mt-0.5">Events shown are from daily brief schedule. Connect Google Calendar in Settings for live sync.</p>
        </div>
      </div>
    </div>
  )
}
