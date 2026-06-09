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

  const buildParams = (searchTerm, status, ds, startDate, endDate) => {
    const params = {}
    if (searchTerm) params.search = searchTerm
    if (status) params.status = status
    if (ds) params.deadline_sort = ds
    if (startDate && endDate) { params.start_date = startDate; params.end_date = endDate }
    return params
  }

  const fetchOrders = useCallback(async (searchTerm, status, ds, startDate, endDate) => {
    setLoading(true)
    try {
      const data = await ordersApi.list(buildParams(searchTerm, status, ds, startDate, endDate))
      setOrders(data)
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    fetchOrders('', '', '', null, null)
  }, [fetchOrders])

  const handleSearch = (value) => {
    setSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchOrders(value, statusFilter, deadlineSort, null, null)
    }, 300)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await ordersApi.delete(deleteTarget.id)
      toast.success(`Order #${deleteTarget.id} deleted`)
      setDeleteTarget(null)
      window.dispatchEvent(new Event('orders-changed'))
      fetchOrders(search, statusFilter, deadlineSort, null, null)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete order')
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Orders</h1>
        <Link
          to="/orders/new"
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Order</span>
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); fetchOrders(search, e.target.value, deadlineSort, null, null) }}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white">
          <option value="">All</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={() => { const next = deadlineSort === 'asc' ? '' : 'asc'; setDeadlineSort(next); fetchOrders(search, statusFilter, next, null, null) }}
          className={`flex items-center gap-1 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${deadlineSort === 'asc' ? 'border-cyan-300 bg-cyan-50 text-cyan-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
          <ArrowUpDown className="w-4 h-4" /> <span className="hidden sm:inline">Deadline</span>
        </button>
        <div className="overflow-x-auto w-full md:w-auto pb-1">
          <DateRangeFilter onChange={(s, e) => fetchOrders(search, statusFilter, deadlineSort, s, e)} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[650px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-medium text-slate-600">#</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden sm:table-cell">Phone</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">Amount</th>
                <th className="text-center px-4 py-3 font-medium text-slate-600">Status</th>
                <th className="text-center px-4 py-3 font-medium text-slate-600 hidden sm:table-cell">Payment</th>
                <th className="text-center px-4 py-3 font-medium text-slate-600 hidden md:table-cell">Deadline</th>
                <th className="text-center px-4 py-3 font-medium text-slate-600 hidden sm:table-cell">Date</th>
                <th className="text-center px-4 py-3 font-medium text-slate-600 w-16">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="text-center py-8 text-slate-400">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-8 text-slate-400">
                  <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  {search ? 'No orders match your search' : 'No orders yet'}
                </td></tr>
              ) : orders.map((o) => (
                <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                  onClick={() => navigate(`/orders/${o.id}`)}>
                  <td className="px-4 py-3 font-medium text-slate-800">#{o.id}</td>
                  <td className="px-4 py-3 text-slate-700 truncate max-w-[120px] md:max-w-none">{o.customer_name}</td>
                  <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{o.customer_phone}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-700">₹{Number(o.total_amount).toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      o.payment_status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {o.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs hidden md:table-cell">
                    {o.deadline ? (
                      <span className={`font-medium ${new Date(o.deadline) < new Date() && o.status !== 'Completed' ? 'text-red-600' : 'text-slate-500'}`}>
                        {new Date(o.deadline).toLocaleDateString()}
                      </span>
                    ) : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-500 text-xs hidden sm:table-cell">
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
