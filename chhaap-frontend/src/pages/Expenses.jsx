import { useEffect, useState, useMemo } from 'react'
import { CreditCard, Trash2, Eye, Pencil } from 'lucide-react'
import toast from 'react-hot-toast'
import { expensesApi } from '../services/api'
import DateRangeFilter from '../components/DateRangeFilter'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'

export default function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [expenseName, setExpenseName] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [expenseDescription, setExpenseDescription] = useState('')
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().slice(0, 10))
  const [paymentMethod, setPaymentMethod] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [viewDetails, setViewDetails] = useState(null)
  const [editing, setEditing] = useState(null)

  const fetch = async (startDate, endDate) => {
    setLoading(true)
    try {
      const params = {}
      if (startDate && endDate) { params.start_date = startDate; params.end_date = endDate }
      setExpenses(await expensesApi.list(params))
    } catch { toast.error('Failed to load expenses') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const resetForm = () => {
    setExpenseName('')
    setExpenseAmount('')
    setExpenseDescription('')
    setExpenseDate(new Date().toISOString().slice(0, 10))
    setPaymentMethod('')
    setEditing(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!expenseAmount || !expenseName) return toast.error('Amount and name required')
    setSubmitting(true)
    try {
      const payload = {
        expense_name: expenseName,
        expense_amount: expenseAmount,
        expense_description: expenseDescription || undefined,
        expense_date: expenseDate,
        payment_method: paymentMethod || undefined,
      }
      if (editing) {
        await expensesApi.update(editing.id, payload)
        toast.success('Expense updated')
      } else {
        await expensesApi.create(payload)
        toast.success('Expense logged')
      }
      resetForm()
      fetch()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (e) => {
    setEditing(e)
    setExpenseName(e.expense_name || e.reason || '')
    setExpenseAmount(e.expense_amount || e.amount || '')
    setExpenseDescription(e.expense_description || '')
    setExpenseDate(e.expense_date || '')
    setPaymentMethod(e.payment_method || '')
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await expensesApi.delete(deleteTarget.id)
      toast.success('Expense deleted')
      setDeleteTarget(null)
      fetch()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete')
    }
  }

  const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + Number(e.expense_amount || e.amount), 0), [expenses])

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Expenses</h1>
        <div className="overflow-x-auto w-full md:w-auto pb-1">
          <DateRangeFilter onChange={(s, e) => fetch(s, e)} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
          <h2 className="font-semibold text-slate-700 mb-4">{editing ? 'Edit Expense' : 'Log Expense'}</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Expense Name *</label>
              <input type="text" value={expenseName} onChange={e => setExpenseName(e.target.value)}
                placeholder="e.g. Stationery, Transport..." required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Amount (रु) *</label>
              <input type="number" min="0" step="0.01" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Payment Method</label>
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                <option value="">Select...</option>
                <option value="QR">QR (Online)</option>
                <option value="Physical Cash">Physical Cash</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
              <textarea value={expenseDescription} onChange={e => setExpenseDescription(e.target.value)} rows={3}
                placeholder="Additional details..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Date</label>
              <input type="date" value={expenseDate} onChange={e => setExpenseDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={submitting}
                className="flex-1 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 text-sm font-medium">
                {submitting ? 'Saving...' : editing ? 'Update Expense' : 'Log Expense'}
              </button>
              {editing && (
                <button type="button" onClick={resetForm}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-700">Expense History</h2>
            <div className="text-sm text-slate-500">
              Total: <span className="font-bold text-red-600">रु{totalExpenses.toLocaleString()}</span>
            </div>
          </div>

          {loading ? (
            <p className="text-slate-400 text-sm">Loading...</p>
          ) : expenses.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
              No expenses logged yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[580px]">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left pb-3 font-medium text-slate-500">Date</th>
                    <th className="text-left pb-3 font-medium text-slate-500">Name</th>
                    <th className="text-left pb-3 font-medium text-slate-500">Method</th>
                    <th className="text-left pb-3 font-medium text-slate-500">Description</th>
                    <th className="text-right pb-3 font-medium text-slate-500">Amount</th>
                    <th className="text-center pb-3 font-medium text-slate-500 w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((e) => {
                    const name = e.expense_name || e.reason
                    const amount = e.expense_amount || e.amount
                    const description = e.expense_description || ''
                    return (
                      <tr key={e.id} className="border-b border-slate-100">
                        <td className="py-2.5 text-slate-600">{e.expense_date}</td>
                        <td className="py-2.5 text-slate-700 font-medium">{name}</td>
                        <td className="py-2.5 text-slate-500 text-xs">
                          {e.payment_method ? <span className={`px-1.5 py-0.5 rounded font-medium ${
                            e.payment_method === 'QR' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                          }`}>{e.payment_method}</span> : <span className="text-slate-300">—</span>}
                        </td>
                        <td className="py-2.5">
                          <button onClick={() => setViewDetails(e)} disabled={!description}
                            className={`text-xs font-medium flex items-center gap-1 px-2 py-1 rounded ${
                              description ? 'text-cyan-600 hover:bg-cyan-50 cursor-pointer' : 'text-slate-300 cursor-not-allowed'
                            }`}>
                            <Eye className="w-3 h-3" />
                            {description ? 'View' : 'None'}
                          </button>
                        </td>
                        <td className="py-2.5 text-right font-medium text-red-600">रु{Number(amount).toLocaleString()}</td>
                        <td className="py-2.5 text-center">
                          <button onClick={() => handleEdit(e)} className="p-1 text-blue-500 hover:bg-blue-50 rounded" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteTarget(e)} className="p-1 text-red-500 hover:bg-red-50 rounded ml-1" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {viewDetails && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setViewDetails(null)}>
          <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Expense Details</h3>
            <div className="space-y-3 text-sm">
              <div><span className="text-slate-500">Name:</span> <span className="font-medium ml-2">{viewDetails.expense_name || viewDetails.reason}</span></div>
              <div><span className="text-slate-500">Amount:</span> <span className="font-medium ml-2 text-red-600">रु{Number(viewDetails.expense_amount || viewDetails.amount).toLocaleString()}</span></div>
              <div><span className="text-slate-500">Method:</span> <span className="font-medium ml-2">{viewDetails.payment_method || '—'}</span></div>
              <div><span className="text-slate-500">Date:</span> <span className="font-medium ml-2">{viewDetails.expense_date}</span></div>
              <div><span className="text-slate-500">Description:</span></div>
              <div className="bg-slate-50 rounded-lg p-3 text-slate-700 whitespace-pre-wrap">{viewDetails.expense_description || 'No description'}</div>
            </div>
            <button onClick={() => setViewDetails(null)}
              className="mt-4 w-full py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm font-medium">Close</button>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={`Expense: रु${deleteTarget?.expense_amount || deleteTarget?.amount || 0} — ${deleteTarget?.expense_name || deleteTarget?.reason || ''}`}
      />
    </div>
  )
}