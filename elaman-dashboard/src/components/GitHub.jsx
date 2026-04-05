import { githubPRs, githubRepos } from '../data/dashboardData'
import { GitPullRequest, GitMerge, Check, Clock, MessageSquare, ExternalLink } from 'lucide-react'

export default function GitHub() {
  const openPRs = githubPRs.filter(p => p.status !== 'merged')
  const mergedPRs = githubPRs.filter(p => p.status === 'merged')

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard label="Open PRs" value={openPRs.length} color="text-blue-600" />
        <StatCard label="Needs Review" value={githubPRs.filter(p => p.status === 'review').length} color="text-amber-600" />
        <StatCard label="Approved" value={githubPRs.filter(p => p.status === 'approved').length} color="text-green-600" />
        <StatCard label="Repos Tracked" value={githubRepos.length} color="text-purple-600" />
      </div>

      {/* PR List */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Pull Requests</h3>
        <div className="space-y-3">
          {githubPRs.map((pr) => (
            <div key={pr.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <PRIcon status={pr.status} />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      {pr.title}
                      <span className="text-gray-400 font-normal ml-2">#{pr.number}</span>
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">{pr.repo}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>by {pr.author}</span>
                      <span>{pr.created}</span>
                      <span className="text-green-600">+{pr.additions}</span>
                      <span className="text-red-500">-{pr.deletions}</span>
                      <span>{pr.files} files</span>
                    </div>
                  </div>
                </div>
                <PRStatusBadge status={pr.status} />
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                <button className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600">
                  <ExternalLink className="w-3 h-3" /> View
                </button>
                {pr.status === 'review' && (
                  <button className="flex items-center gap-1 text-xs text-green-500 hover:text-green-600">
                    <Check className="w-3 h-3" /> Approve
                  </button>
                )}
                {pr.status === 'approved' && (
                  <button className="flex items-center gap-1 text-xs text-purple-500 hover:text-purple-600">
                    <GitMerge className="w-3 h-3" /> Merge
                  </button>
                )}
                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
                  <MessageSquare className="w-3 h-3" /> Comment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tracked Repos */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Tracked Repositories</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {githubRepos.map((repo) => (
            <div key={repo} className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 flex items-center gap-3 hover:shadow-md transition-shadow">
              <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                <GitPullRequest className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{repo.split('/')[1]}</p>
                <p className="text-xs text-gray-400">{repo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

function PRIcon({ status }) {
  if (status === 'merged') return <GitMerge className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
  if (status === 'approved') return <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
  return <GitPullRequest className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
}

function PRStatusBadge({ status }) {
  const map = {
    open: { label: 'Open', cls: 'bg-blue-100 text-blue-700' },
    review: { label: 'Review Required', cls: 'bg-amber-100 text-amber-700' },
    approved: { label: 'Approved', cls: 'bg-green-100 text-green-700' },
    merged: { label: 'Merged', cls: 'bg-purple-100 text-purple-700' },
  }
  const { label, cls } = map[status] || map.open
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${cls}`}>{label}</span>
}
