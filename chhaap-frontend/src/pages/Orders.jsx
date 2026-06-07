import { useEffect, useState, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, ShoppingCart, Trash2, ArrowUpDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { ordersApi } from '../services/api'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'
import DateRangeFilter from '../components/DateRangeFilter'

const STATUS_COLORS = {
  'Confirmed': 'bg-slate-100 text-slate-700',
  'Design Done': 'bg-purple-100 text-purple-700',
  'In Printing': 'bg-blue-100 text-blue-700',
  'Printing Done': 'bg-indigo-100 text-indigo-700',
  'Delivery in Progress': 'bg-orange-100 text-orange-700',
  'Delivered': 'bg-green-100 text-green-700',
  'Completed': 'bg-emerald-100 text-emerald-700',
}

const STATUSES = [
  'Confirmed', 'Design Done', 'In Printing', 'Printing Done',
  'Delivery in Progress', 'Delivered', 'Completed',
]

export default function Orders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [deadlineSort, setDeadlineSort] = useState('')
  const debounceRef = useRef(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const buildParams = (searchTerm, status, ds) => {
    const params = {}
    if (searchTerm) params.search = searchTerm
    if (status) params.status = status
    if (ds) params.deadline_sort = ds
    return params
  }

  const fetchOrders = useCallback(async (searchTerm, status, ds) => {
    try {
      const data = await ordersApi.list(buildParams(searchTerm, status, ds))
      setOrders(data)
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [])

  const fetchOrdersWithDates = useCallback(async (searchTerm, status, ds, startDate, endDate) => {
    try {
      const params = buildParams(searchTerm, status, ds)
      if (startDate && endDate) { params.start_date = startDate; params.end_date = endDate }
      const data = await ordersApi.list(params)
      setOrders(data)
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await ordersApi.delete(deleteTarget.id)
      toast.success(`Order #${deleteTarget.id} deleted`)
      setDeleteTarget(null)
      fetchOrdersWithDates(search, statusFilter, deadlineSort)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete order')
    }
  }

  useEffect(() => {
    fetchOrders('', '', '')
  }, [fetchOrders])

  const handleSearch = (value) => {
    setSearch(value)
    setLoading(true)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchOrdersWithDates(value, statusFilter, deadlineSort)
    }, 300)
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
        <Link
          to="/orders/new"
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> New Order
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order ID, customer name, or phone..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setLoading(true); fetchOrdersWithDates(search, e.target.value, deadlineSort) }}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white">
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={() => { const next = deadlineSort === 'asc' ? '' : 'asc'; setDeadlineSort(next); setLoading(true); fetchOrdersWithDates(search, statusFilter, next) }}
          className={`flex items-center gap-1 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${deadlineSort === 'asc' ? 'border-cyan-300 bg-cyan-50 text-cyan-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
          <ArrowUpDown className="w-4 h-4" /> Deadline
        </button>
        <DateRangeFilter onChange={(s, e) => fetchOrdersWithDates(search, statusFilter, deadlineSort, s, e)} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 font-medium text-slate-600">#</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Customer</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Phone</th>
              <th className="text-right px-4 py-3 font-medium text-slate-600">Amount</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">Status</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">Payment</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">Deadline</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600">Date</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600 w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-8 text-slate-400">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-slate-400">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                {search ? 'No orders match your search' : 'No orders yet'}
              </td></tr>
            ) : orders.map((o) => (
              <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                onClick={() => navigate(`/orders/${o.id}`)}>
                <td className="px-4 py-3 font-medium text-slate-800">#{o.id}</td>
                <td className="px-4 py-3 text-slate-700">{o.customer_name}</td>
                <td className="px-4 py-3 text-slate-500">{o.customer_phone}</td>
                <td className="px-4 py-3 text-right font-medium text-slate-700">₹{Number(o.total_amount).toLocaleString()}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[o.status]}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    o.payment_status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {o.payment_status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-xs">
                  {o.deadline ? (
                    <span className={`font-medium ${new Date(o.deadline) < new Date() && o.status !== 'Completed' ? 'text-red-600' : 'text-slate-500'}`}>
                      {new Date(o.deadline).toLocaleDateString()}
                      {new Date(o.deadline) < new Date() && o.status !== 'Completed' && <span className="ml-1">⚠</span>}
                    </span>
                  ) : <span className="text-slate-300">—</span>}
                </td>
                <td className="px-4 py-3 text-center text-slate-500 text-xs">
                  {new Date(o.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={e => { e.stopPropagation(); setDeleteTarget(o) }}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget ? `Order #${deleteTarget.id} — ${deleteTarget.customer_name}` : ''}
      />
    </div>
  )
}
