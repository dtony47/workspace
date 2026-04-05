import { financials, projects } from '../data/dashboardData'
import { PoundSterling, TrendingUp, TrendingDown, Target } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts'

export default function Financials() {
  const { mrr, costs, mrrHistory } = financials
  const profit = mrr.current - costs.monthly.total
  const projectROI = projects
    .filter(p => p.mrrCurrent > 0)
    .map(p => ({
      name: p.name,
      revenue: p.mrrCurrent,
      spent: p.budget.spent,
      roi: p.budget.spent > 0 ? ((p.mrrCurrent / p.budget.spent) * 100).toFixed(0) : 'N/A',
    }))

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Current MRR" value={`£${mrr.current.toLocaleString()}`} subtitle={`Target: £${mrr.target.toLocaleString()}`} icon={TrendingUp} color="green" />
        <MetricCard title="Monthly Costs" value={`£${costs.monthly.total.toFixed(2)}`} subtitle={`Budget: £${costs.monthly.budget.toFixed(2)}`} icon={TrendingDown} color="red" />
        <MetricCard title="Net Profit" value={`£${profit.toFixed(2)}`} subtitle="MRR minus costs" icon={PoundSterling} color="blue" />
        <MetricCard title="MRR Progress" value={`${((mrr.current / mrr.target) * 100).toFixed(1)}%`} subtitle="Towards £15k target" icon={Target} color="amber" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* MRR Growth */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">MRR Growth Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mrrHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `£${v}`} />
              <Tooltip formatter={(v) => `£${v}`} />
              <Line type="monotone" dataKey="mrr" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Breakdown Pie */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Revenue by Project</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={mrr.breakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="amount"
                nameKey="project"
                paddingAngle={3}
                label={({ project, amount }) => `£${amount}`}
              >
                {mrr.breakdown.map((entry) => (
                  <Cell key={entry.project} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `£${v}`} />
              <Legend verticalAlign="bottom" iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Cost Breakdown</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={costs.breakdown} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => `£${v}`} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 12 }} width={80} />
              <Tooltip formatter={(v) => `£${v.toFixed(2)}`} />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                {costs.breakdown.map((entry) => (
                  <Cell key={entry.category} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Total Spent</span>
              <span className="font-semibold text-gray-900">£{costs.monthly.total.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-500">Budget Remaining</span>
              <span className="font-semibold text-green-600">£{(costs.monthly.budget - costs.monthly.total).toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(costs.monthly.total / costs.monthly.budget) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Project ROI */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Project ROI</h4>
          {projectROI.length > 0 ? (
            <div className="space-y-4">
              {projectROI.map((p) => (
                <div key={p.name} className="p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{p.name}</span>
                    <span className="text-xs font-semibold text-green-600">ROI: {p.roi}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400">Revenue:</span>{' '}
                      <span className="text-gray-700 font-medium">£{p.revenue}/mo</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Invested:</span>{' '}
                      <span className="text-gray-700 font-medium">£{p.spent}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No revenue-generating projects yet</p>
          )}

          {/* MRR Target Progress */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Year-End MRR Target</h5>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-green-600">£{mrr.current.toLocaleString()}</span>
              <span className="text-sm text-gray-400">/ £{mrr.target.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 mt-2">
              <div className="bg-green-500 h-3 rounded-full transition-all" style={{ width: `${(mrr.current / mrr.target) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, subtitle, icon: Icon, color }) {
  const colors = {
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
  }
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">{title}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  )
}
