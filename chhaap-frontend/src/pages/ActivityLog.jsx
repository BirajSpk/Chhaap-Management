import { useEffect, useState } from 'react'
import { Activity, Search, Trash2, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { activityApi } from '../services/api'
import DateRangeFilter from '../components/DateRangeFilter'

const moduleColors = {
  ORDERS: 'bg-blue-100 text-blue-700',
  EXPENSES: 'bg-green-100 text-green-700',
  PRODUCTS: 'bg-purple-100 text-purple-700',
  CUSTOMERS: 'bg-orange-100 text-orange-700',
  SYSTEM: 'bg-slate-100 text-slate-700',
}

const actionColors = {
  CREATE: 'bg-green-100 text-green-700',
  UPDATE: 'bg-blue-100 text-blue-700',
  DELETE: 'bg-red-100 text-red-700',
}

export default function ActivityLog() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [moduleFilter, setModuleFilter] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [pagination, setPagination] = useState({ page: 1, per_page: 50, total: 0, total_pages: 1 })
  const [showClearModal, setShowClearModal] = useState(false)
  const [clearTyped, setClearTyped] = useState('')
  const [dateRange, setDateRange] = useState({ start: null, end: null })

  const fetch = async () => {
    setLoading(true)
    try {
      const params = {
        page,
        per_page: 50,
        search: search || undefined,
        module: moduleFilter || undefined,
        action_type: actionFilter || undefined,
        start_date: dateRange.start || undefined,
        end_date: dateRange.end || undefined,
      }
      const res = await activityApi.list(params)
      setLogs(res.data || [])
      setPagination(res.pagination || { page: 1, per_page: 50, total: 0, total_pages: 1 })
    } catch {
      toast.error('Failed to load activity logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [page, search, moduleFilter, actionFilter, dateRange])

  const handleDateChange = (start, end) => {
    setPage(1)
    setDateRange({ start, end })
  }

  const handleClear = async () => {
    try {
      await activityApi.clear('DELETE')
      toast.success('Activity logs cleared')
      setShowClearModal(false)
      setClearTyped('')
      setPage(1)
      fetch()
    } catch {
      toast.error('Failed to clear logs')
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Activity className="w-6 h-6 text-slate-500" />
          Activity Log
        </h1>
        <button
          onClick={() => setShowClearModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Logs
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search logs..."
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <select
          value={moduleFilter}
          onChange={e => { setModuleFilter(e.target.value); setPage(1) }}
          className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">All Modules</option>
          <option value="SYSTEM">SYSTEM</option>
          <option value="ORDERS">ORDERS</option>
          <option value="EXPENSES">EXPENSES</option>
          <option value="PRODUCTS">PRODUCTS</option>
          <option value="CUSTOMERS">CUSTOMERS</option>
        </select>
        <select
          value={actionFilter}
          onChange={e => { setActionFilter(e.target.value); setPage(1) }}
          className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">All Actions</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
        </select>
        <div className="overflow-x-auto pb-1">
          <DateRangeFilter onChange={handleDateChange} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No activity logs found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[580px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 font-medium text-slate-500">Timestamp</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">User</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">Module</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">Action</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">Description</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-2.5 text-slate-600 whitespace-nowrap">{log.created_at}</td>
                    <td className="px-4 py-2.5 text-slate-700 font-medium">{log.user_name || log.user?.name || '—'}</td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${moduleColors[log.module] || 'bg-slate-100 text-slate-700'}`}>
                        {log.module}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${actionColors[log.action_type] || 'bg-slate-100 text-slate-700'}`}>
                        {log.action_type}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">{log.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 text-sm font-medium border border-slate-300 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500">
            Page {pagination.page} of {pagination.total_pages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(pagination.total_pages, p + 1))}
            disabled={page >= pagination.total_pages}
            className="px-3 py-1.5 text-sm font-medium border border-slate-300 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {showClearModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => { setShowClearModal(false); setClearTyped('') }}>
          <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-bold text-slate-800">Clear All Logs</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              This action is irreversible. Type <span className="font-bold text-red-600">DELETE</span> to confirm.
            </p>
            <input
              type="text"
              value={clearTyped}
              onChange={e => setClearTyped(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setShowClearModal(false); setClearTyped('') }}
                className="flex-1 py-2 text-sm font-medium border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleClear}
                disabled={clearTyped !== 'DELETE'}
                className="flex-1 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
