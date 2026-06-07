import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Check, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { ordersApi } from '../services/api'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'

const STATUSES = [
  'Confirmed', 'Design Done', 'In Printing', 'Printing Done',
  'Delivery in Progress', 'Delivered', 'Completed',
]

const STATUS_COLORS = {
  'Confirmed': 'bg-slate-500',
  'Design Done': 'bg-purple-500',
  'In Printing': 'bg-blue-500',
  'Printing Done': 'bg-indigo-500',
  'Delivery in Progress': 'bg-orange-500',
  'Delivered': 'bg-green-500',
  'Completed': 'bg-emerald-500',
}

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [completeTyped, setCompleteTyped] = useState('')

  const fetchOrder = async () => {
    try { setOrder(await ordersApi.get(id)) }
    catch { toast.error('Order not found') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchOrder() }, [id])

  const handleStatusChange = async (newStatus) => {
    if (!order || newStatus === order.status) return

    if (newStatus === 'Completed') {
      setShowCompleteModal(true)
      return
    }

    setUpdating(true)
    try {
      const updated = await ordersApi.updateStatus(id, newStatus)
      setOrder(updated)
      toast.success(`Order moved to "${newStatus}"`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const handleCompleteConfirm = async () => {
    if (completeTyped !== 'COMPLETE') return
    setShowCompleteModal(false)
    setCompleteTyped('')
    setUpdating(true)
    try {
      const updated = await ordersApi.updateStatus(id, 'Completed', 'COMPLETE')
      setOrder(updated)
      toast.success('Order completed!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to complete order')
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    try {
      await ordersApi.delete(id)
      toast.success(`Order #${id} deleted`)
      navigate('/orders')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete order')
    }
  }

  if (loading) return <div className="p-6 text-slate-500">Loading...</div>
  if (!order) return <div className="p-6 text-red-500">Order not found</div>

  const currentIdx = STATUSES.indexOf(order.status)
  const isCompleted = order.status === 'Completed'
  const deadlineDate = order.deadline ? new Date(order.deadline) : null
  const isOverdue = deadlineDate && !isCompleted && deadlineDate < new Date()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/orders" className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Order #{order.id}</h1>
        </div>
        <div className="flex items-center gap-2">
          {!isCompleted && (
            <>
              <button onClick={() => setShowDelete(true)}
                className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 font-medium flex items-center gap-1">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
              <Link to={`/orders/${id}/edit`} className="px-3 py-2 text-sm text-cyan-600 border border-cyan-300 rounded-lg hover:bg-cyan-50 font-medium flex items-center gap-1">
                <Pencil className="w-4 h-4" /> Edit
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-700 mb-4">Status Pipeline</h2>
        <div className="flex items-center gap-0">
          {STATUSES.map((s, i) => {
            const clickable = !isCompleted && s !== order.status
            return (
              <div key={s} className="flex-1 flex flex-col items-center relative">
                <div className="flex items-center w-full">
                  <div className={`h-1 flex-1 ${i === 0 ? 'invisible' : i <= currentIdx ? STATUS_COLORS[s] : 'bg-slate-200'}`} />
                </div>
                <button type="button"
                  onClick={() => clickable && handleStatusChange(s)}
                  disabled={!clickable}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold -mt-4 z-10 transition-all
                    ${i < currentIdx ? `${STATUS_COLORS[s]} text-white` : 
                      i === currentIdx ? `${STATUS_COLORS[s]} text-white ring-4 ring-cyan-200` : 
                      'bg-slate-200 text-slate-500'}
                    ${clickable ? 'cursor-pointer hover:ring-2 hover:ring-cyan-300' : 'cursor-default'}`}>
                  {i < currentIdx ? <Check className="w-4 h-4" /> : i + 1}
                </button>
                <div className={`text-xs mt-1 text-center font-medium ${i <= currentIdx ? 'text-slate-800' : 'text-slate-400'}`}
                  style={{ writingMode: 'horizontal-tb' }}>
                  {s}
                </div>
                <div className={`h-1 flex-1 ${i === STATUSES.length - 1 ? 'invisible' : i < currentIdx ? STATUS_COLORS[s] : 'bg-slate-200'}`} />
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-700 mb-3">Customer Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Name</span><span className="font-medium">{order.customer_name}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Phone</span><span className="font-medium">{order.customer_phone}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Address</span><span className="font-medium text-right max-w-[200px]">{order.customer_address}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Total Amount</span><span className="font-bold text-lg">₹{Number(order.total_amount).toLocaleString()}</span></div>
            {Number(order.advance_payment) > 0 && (
              <div className="flex justify-between"><span className="text-slate-500">Advance Paid</span>
                <span className="font-medium text-green-600">₹{Number(order.advance_payment).toLocaleString()}</span>
              </div>
            )}
            {Number(order.advance_payment) > 0 && !isCompleted && (
              <div className="flex justify-between"><span className="text-slate-500">Balance Due</span>
                <span className="font-medium text-orange-600">₹{Math.max(0, Number(order.total_amount) - Number(order.advance_payment)).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between"><span className="text-slate-500">Payment</span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                order.payment_status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>{order.payment_status}</span>
            </div>
            {deadlineDate && (
              <div className="flex justify-between">
                <span className="text-slate-500">Deadline</span>
                <span className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                  {deadlineDate.toLocaleDateString()}
                  {isOverdue && <span className="ml-1 text-red-600 text-xs">(Overdue!)</span>}
                </span>
              </div>
            )}
            <div className="flex justify-between"><span className="text-slate-500">Created</span><span className="font-medium">{new Date(order.created_at).toLocaleString()}</span></div>
            {order.notes && (
              <div className="pt-2 border-t border-slate-200 mt-2">
                <span className="text-slate-500 text-xs block mb-1">Order Notes</span>
                <span className="font-medium text-sm">{order.notes}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-700 mb-3">Order Items</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left pb-2 font-medium text-slate-500">Product</th>
                <th className="text-center pb-2 font-medium text-slate-500">Qty</th>
                <th className="text-right pb-2 font-medium text-slate-500">Price</th>
                <th className="text-right pb-2 font-medium text-slate-500">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="py-2 font-medium text-slate-700">{item.product_name}</td>
                  <td className="py-2 text-center text-slate-600">{item.quantity}</td>
                  <td className="py-2 text-right text-slate-600">₹{Number(item.sold_price).toLocaleString()}</td>
                  <td className="py-2 text-right font-medium text-slate-700">₹{(Number(item.sold_price) * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Completed confirmation modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => { setShowCompleteModal(false); setCompleteTyped('') }}>
          <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Complete Order #{order.id}?</h2>
            <p className="text-sm text-slate-600 mb-4">
              Once completed, this order will count toward revenue and cannot be changed.
            </p>
            <p className="text-sm text-slate-600 mb-3">
              Type <span className="font-bold text-emerald-600">COMPLETE</span> to confirm:
            </p>
            <input
              value={completeTyped}
              onChange={e => setCompleteTyped(e.target.value)}
              placeholder="Type COMPLETE here..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-4"
            />
            <div className="flex gap-3">
              <button onClick={handleCompleteConfirm}
                disabled={completeTyped !== 'COMPLETE'}
                className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-40 font-medium text-sm">
                Complete Order
              </button>
              <button onClick={() => { setShowCompleteModal(false); setCompleteTyped('') }}
                className="px-4 py-2.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        itemName={`Order #${order.id} — ${order.customer_name}`}
      />
    </div>
  )
}
