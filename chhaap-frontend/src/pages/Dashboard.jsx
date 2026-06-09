import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts'
import {
  TrendingUp, DollarSign, Clock, CreditCard, Activity, ShoppingCart, ArrowUpCircle, ArrowDownCircle, Repeat,
} from 'lucide-react'
import { analyticsApi } from '../services/api'
import DateRangeFilter from '../components/DateRangeFilter'

const STATUS_COLORS = {
  'Confirmed': 'bg-slate-100 text-slate-700',
  'Design Done': 'bg-purple-100 text-purple-700',
  'In Printing': 'bg-blue-100 text-blue-700',
  'Printing Done': 'bg-indigo-100 text-indigo-700',
  'Delivery in Progress': 'bg-orange-100 text-orange-700',
  'Delivered': 'bg-green-100 text-green-700',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async (startDate, endDate) => {
    setLoading(true)
    try {
      const params = {}
      if (startDate && endDate) { params.start_date = startDate; params.end_date = endDate }
      const res = await analyticsApi.get(params)
      setData(res)
    } catch { /* ignore */ } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  if (loading) return <div className="p-6 text-slate-500">Loading...</div>
  if (!data) return <div className="p-6 text-red-500">Failed to load dashboard</div>

  const summaryCards = [
    { label: 'Revenue', value: data.revenue, icon: TrendingUp, color: 'bg-emerald-500' },
    { label: 'Net Amount', value: data.net_amount, icon: DollarSign, color: 'bg-blue-500' },
    { label: 'Pending Amount', value: data.pending_amount, icon: Clock, color: 'bg-orange-500' },
    { label: 'Total Orders', value: data.total_orders, icon: ShoppingCart, color: 'bg-violet-500', isCount: true },
    { label: 'Active Orders', value: data.active_order_count, icon: ShoppingCart, color: 'bg-amber-500', isCount: true },
    { label: 'Incoming Txns', value: data.incoming_transactions, icon: ArrowUpCircle, color: 'bg-emerald-500', isCount: true },
    { label: 'Outgoing Txns', value: data.outgoing_transactions, icon: ArrowDownCircle, color: 'bg-red-500', isCount: true },
    { label: 'Total Txns', value: data.total_transactions, icon: Repeat, color: 'bg-indigo-500', isCount: true },
    { label: 'Expenses', value: data.total_expenses, icon: CreditCard, color: 'bg-red-500' },
  ]

  const chartData = data.weekly_trend?.length
    ? data.weekly_trend.map(d => ({ date: d.date.slice(5), revenue: Number(d.revenue) }))
    : []

  const projData = data.projections
    ? [
        { label: 'Weekly', value: data.projections.weekly },
        { label: 'Monthly', value: data.projections.monthly },
        { label: 'Yearly', value: data.projections.yearly },
      ]
    : []

  const activeStatuses = ['Confirmed', 'Design Done', 'In Printing', 'Printing Done', 'Delivery in Progress', 'Delivered']
  const ordersByStatus = {}
  activeStatuses.forEach(s => { ordersByStatus[s] = [] })
  ;(data.active_orders || []).forEach(o => {
    if (ordersByStatus[o.status]) ordersByStatus[o.status].push(o)
  })

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Dashboard</h1>
        <div className="overflow-x-auto w-full md:w-auto pb-1">
          <DateRangeFilter onChange={(s, e) => fetchData(s, e)} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {summaryCards.map(({ label, value, icon: Icon, color, isCount }) => {
          const isNegative = !isCount && Number(value) < 0
          return (
            <div key={label} className="bg-white rounded-xl border border-slate-200 p-3 md:p-4 flex items-center gap-3 md:gap-4">
              <div className={`w-10 h-10 md:w-12 md:h-12 ${color} rounded-lg flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-slate-500 truncate">{label}</p>
                <p className={`text-base md:text-xl font-bold ${isNegative ? 'text-red-600' : 'text-slate-800'}`}>
                  {isCount ? value : `₹${Number(value).toLocaleString()}`}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4 md:p-5">
          <h2 className="font-semibold text-slate-700 mb-4">Revenue Trend</h2>
          {chartData.length > 0 ? (
            <div className="w-full overflow-hidden">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => [`₹${v}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-slate-400 text-sm py-10 text-center">No data for selected period</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
          <h2 className="font-semibold text-slate-700 mb-4">Projected Net Amount</h2>
          {projData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={projData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => [`₹${v}`, 'Est. Net']} />
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-400 text-sm py-10 text-center">No data for projections</p>
          )}
          <div className="mt-3 space-y-2">
            {projData.map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-slate-500">{label}</span>
                <span className="font-medium text-slate-700">₹{Number(value).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {data.active_orders?.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
          <h2 className="font-semibold text-slate-700 mb-4">Active Orders Pipeline</h2>
          <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left pb-2 font-medium text-slate-500">#</th>
                  <th className="text-left pb-2 font-medium text-slate-500">Customer</th>
                  <th className="text-right pb-2 font-medium text-slate-500">Amount</th>
                  <th className="text-right pb-2 font-medium text-slate-500">Advance</th>
                  <th className="text-center pb-2 font-medium text-slate-500">Status</th>
                  <th className="text-center pb-2 font-medium text-slate-500">Payment</th>
                  <th className="text-center pb-2 font-medium text-slate-500">Since</th>
                </tr>
              </thead>
              <tbody>
                {data.active_orders.map(o => (
                  <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                    onClick={() => navigate(`/orders/${o.id}`)}>
                    <td className="py-2 font-medium text-slate-800">#{o.id}</td>
                    <td className="py-2 text-slate-700">{o.customer_name}</td>
                    <td className="py-2 text-right font-medium text-slate-700">₹{Number(o.total_amount).toLocaleString()}</td>
                    <td className="py-2 text-right text-slate-600">
                      {Number(o.advance_payment) > 0 ? `₹${Number(o.advance_payment).toLocaleString()}` : '—'}
                    </td>
                    <td className="py-2 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        o.payment_status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>{o.payment_status}</span>
                    </td>
                    <td className="py-2 text-center text-slate-400 text-xs">
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-blue-500" />
          <h2 className="font-semibold text-slate-700">Recent Activity</h2>
        </div>
        {data.recent_activity?.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {data.recent_activity.map((a) => (
              <div key={a.id} className="px-3 py-2 bg-slate-50 rounded-lg text-sm text-slate-600">
                {a.description}
                <span className="text-xs text-slate-400 ml-2">
                  {new Date(a.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm">No recent activity</p>
        )}
      </div>
    </div>
  )
}
