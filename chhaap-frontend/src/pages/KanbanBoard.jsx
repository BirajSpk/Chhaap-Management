import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import toast from 'react-hot-toast'
import { ordersApi } from '../services/api'

const COLUMNS = [
  { id: 'Confirmed', label: 'Confirmed', color: 'border-l-slate-500' },
  { id: 'Design Done', label: 'Design Done', color: 'border-l-purple-500' },
  { id: 'In Printing', label: 'In Printing', color: 'border-l-blue-500' },
  { id: 'Printing Done', label: 'Printing Done', color: 'border-l-indigo-500' },
  { id: 'Delivery in Progress', label: 'Delivery in Progress', color: 'border-l-orange-500' },
  { id: 'Delivered', label: 'Delivered', color: 'border-l-green-500' },
  { id: 'Completed', label: 'Completed', color: 'border-l-emerald-500' },
]

const payLabel = (status, advance) =>
  !(status === 'Completed') && advance > 0 && status === 'Pending' ? 'Advance Paid' : status

export default function KanbanBoard() {
  const navigate = useNavigate()
  const [columns, setColumns] = useState({})
  const [loading, setLoading] = useState(true)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [pendingComplete, setPendingComplete] = useState(null)
  const [completeTyped, setCompleteTyped] = useState('')
  const [completePaymentMethod, setCompletePaymentMethod] = useState('')
  const [completeOnlineAmount, setCompleteOnlineAmount] = useState('')
  const [completeCashAmount, setCompleteCashAmount] = useState('')

  const fetchOrders = useCallback(async () => {
    try {
      const orders = await ordersApi.list()
      const grouped = {}
      COLUMNS.forEach(c => { grouped[c.id] = { ...c, items: [] } })
      orders.forEach(o => {
        if (grouped[o.status]) {
          grouped[o.status].items.push(o)
        }
      })
      setColumns(grouped)
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const destStatus = destination.droppableId

    if (destStatus === 'Completed') {
      setPendingComplete(draggableId)
      setShowCompleteModal(true)
      return
    }

    const newColumns = { ...columns }
    const sourceCol = { ...newColumns[source.droppableId] }
    const destCol = { ...newColumns[destStatus] }
    const [moved] = sourceCol.items.splice(source.index, 1)
    moved.status = destStatus
    destCol.items.splice(destination.index, 0, moved)
    newColumns[source.droppableId] = sourceCol
    newColumns[destStatus] = destCol
    setColumns(newColumns)

    try {
      await ordersApi.updateStatus(draggableId, destStatus)
      window.dispatchEvent(new Event('orders-changed'))
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update status')
      fetchOrders()
    }
  }

  const handleCompleteConfirm = async () => {
    if (completeTyped !== 'COMPLETE') return
    if (!completePaymentMethod) { toast.error('Select a payment method'); return }
    if (!pendingComplete) return

    const allItems = Object.values(columns).flatMap(c => c.items)
    const order = allItems.find(i => String(i.id) === String(pendingComplete))
    if (completePaymentMethod === 'Hybrid' && order) {
      const online = Number(completeOnlineAmount || 0)
      const cash = Number(completeCashAmount || 0)
      if (online + cash !== Number(order.total_amount)) {
        toast.error(`Online + Cash must equal रु${Number(order.total_amount).toLocaleString()}`)
        return
      }
    }

    setShowCompleteModal(false)
    setCompleteTyped('')

    const newColumns = { ...columns }
    for (const colId of Object.keys(newColumns)) {
      const col = { ...newColumns[colId] }
      col.items = col.items.filter(i => String(i.id) !== pendingComplete)
      newColumns[colId] = col
    }
    setColumns(newColumns)

    try {
      const payload = { confirm_text: 'COMPLETE', payment_method: completePaymentMethod }
      if (completePaymentMethod === 'Hybrid') {
        payload.online_amount = completeOnlineAmount
        payload.cash_amount = completeCashAmount
      }
      await ordersApi.updateStatus(pendingComplete, 'Completed', payload)
      window.dispatchEvent(new Event('orders-changed'))
      setPendingComplete(null)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed')
      fetchOrders()
    }
  }

  if (loading) return <div className="p-6 text-slate-500">Loading...</div>

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold text-slate-800 mb-4">Kanban Board</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col lg:flex-row lg:gap-3 lg:overflow-x-auto lg:pb-4 min-h-[calc(100vh-180px)]">
          {COLUMNS.map(col => {
            const isCompleted = col.id === 'Completed'
            const items = columns[col.id]?.items || []
            return (
              <div key={col.id} className="w-full lg:w-64 lg:flex-shrink-0 bg-slate-100 rounded-xl border border-slate-200 flex flex-col mb-3 lg:mb-0">
                <div className={`px-3 py-2.5 font-semibold text-sm text-slate-700 border-b border-slate-200 ${col.color} border-l-4 rounded-t-xl bg-white`}>
                  {col.label}
                  <span className="ml-2 text-xs text-slate-400 font-normal">({items.length})</span>
                </div>
                <Droppable droppableId={col.id}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}
                      className="flex-1 p-2 space-y-2 overflow-y-auto min-h-[100px]">
                      {!isCompleted && items.map((order, index) => (
                        <Draggable key={String(order.id)} draggableId={String(order.id)} index={index}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                              onClick={() => navigate(`/orders/${order.id}`)}
                              className={`bg-white rounded-lg border border-slate-200 p-3 text-sm cursor-pointer transition-shadow
                                ${snapshot.isDragging ? 'shadow-lg ring-2 ring-cyan-300' : 'hover:shadow-md'}`}>
                              <div className="font-medium text-slate-800">#{order.id}</div>
                              <div className="text-slate-600 text-xs truncate mt-0.5">{order.customer_name}</div>
                              <div className="flex items-center justify-between mt-2 text-xs">
                                <span className="font-medium text-slate-700">रु{Number(order.total_amount).toLocaleString()}</span>
                                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                  order.payment_status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>{payLabel(order.payment_status, Number(order.advance_payment))}</span>
                              </div>
                              {Number(order.advance_payment) > 0 && (
                                <div className="text-xs text-slate-400 mt-1">Adv: रु{Number(order.advance_payment).toLocaleString()}</div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )
          })}
        </div>
      </DragDropContext>

      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => { setShowCompleteModal(false); setCompleteTyped(''); setCompletePaymentMethod('') }}>
          <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-sm mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Complete Order #{pendingComplete}?</h2>
            <p className="text-sm text-slate-600 mb-4">Once completed, this order will count toward revenue and cannot be changed.</p>

            <label className="block text-sm font-medium text-slate-600 mb-1">Payment Method</label>
            <div className="flex gap-2 mb-4">
              {['QR', 'COD', 'Physical Cash', 'Hybrid'].map(m => (
                <button key={m} onClick={() => { setCompletePaymentMethod(m); if (m !== 'Hybrid') { setCompleteOnlineAmount(''); setCompleteCashAmount('') } }}
                  className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium border transition ${completePaymentMethod === m ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-300 hover:border-emerald-400'}`}>
                  {m}
                </button>
              ))}
            </div>

            {completePaymentMethod === 'Hybrid' && (
              <div className="flex gap-2 mb-4">
                <input type="number" min="0" step="0.01" placeholder="Online Amount" value={completeOnlineAmount} onChange={e => setCompleteOnlineAmount(e.target.value)}
                  className="w-1/2 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <input type="number" min="0" step="0.01" placeholder="Cash Amount" value={completeCashAmount} onChange={e => setCompleteCashAmount(e.target.value)}
                  className="w-1/2 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            )}

            <p className="text-sm text-slate-600 mb-3">Type <span className="font-bold text-emerald-600">COMPLETE</span> to confirm:</p>
            <input value={completeTyped} onChange={e => setCompleteTyped(e.target.value)} placeholder="Type COMPLETE here..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-4" />
            <div className="flex gap-3">
              <button onClick={handleCompleteConfirm} disabled={completeTyped !== 'COMPLETE'}
                className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-40 font-medium text-sm">Complete Order</button>
              <button onClick={() => { setShowCompleteModal(false); setCompleteTyped(''); setCompletePaymentMethod('') }}
                className="px-4 py-2.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}