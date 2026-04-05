import { priorityEmails } from '../data/dashboardData'
import { Mail, AlertCircle, Archive, Reply, Clock, Star, Inbox } from 'lucide-react'

export default function Email() {
  const unread = priorityEmails.filter(e => !e.read)
  const read = priorityEmails.filter(e => e.read)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard label="Unread Priority" value={unread.length} color="text-red-600" icon={Mail} />
        <StatCard label="Total Priority" value={priorityEmails.length} color="text-blue-600" icon={Inbox} />
        <StatCard label="Avg Priority Score" value={Math.round(priorityEmails.reduce((s, e) => s + e.priorityScore, 0) / priorityEmails.length)} color="text-amber-600" icon={Star} />
        <StatCard label="Sources" value="DWP, Hays" color="text-purple-600" icon={AlertCircle} isText />
      </div>

      {/* Unread Priority */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Unread Priority ({unread.length})
        </h3>
        <div className="space-y-3">
          {unread.map((email) => (
            <EmailCard key={email.id} email={email} />
          ))}
        </div>
      </div>

      {/* Read */}
      {read.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Previously Read ({read.length})
          </h3>
          <div className="space-y-3">
            {read.map((email) => (
              <EmailCard key={email.id} email={email} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function EmailCard({ email }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border p-4 ${email.read ? 'border-gray-200' : 'border-blue-200 bg-blue-50/30'}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${email.read ? 'bg-gray-100' : 'bg-blue-100'}`}>
            <Mail className={`w-4 h-4 ${email.read ? 'text-gray-400' : 'text-blue-500'}`} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{email.from}</h4>
            <p className="text-xs text-gray-400">{email.sender}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{email.received}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            email.priorityScore >= 80 ? 'bg-red-100 text-red-700' :
            email.priorityScore >= 60 ? 'bg-amber-100 text-amber-700' :
            'bg-gray-100 text-gray-600'
          }`}>
            {email.priorityScore}/100
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-700 mb-2">{email.subject}</p>
      <div className="flex items-center gap-1 mb-3">
        <AlertCircle className="w-3 h-3 text-amber-500" />
        <span className="text-xs text-gray-400">{email.reason}</span>
      </div>
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <button className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600"><Mail className="w-3 h-3" /> Read</button>
        <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"><Archive className="w-3 h-3" /> Archive</button>
        <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"><Reply className="w-3 h-3" /> Reply</button>
        <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"><Clock className="w-3 h-3" /> Snooze</button>
      </div>
    </div>
  )
}

function StatCard({ label, value, color, icon: Icon, isText }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm text-gray-500">{label}</p>
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <p className={`${isText ? 'text-sm font-semibold' : 'text-2xl font-bold'} ${color}`}>{value}</p>
    </div>
  )
}
