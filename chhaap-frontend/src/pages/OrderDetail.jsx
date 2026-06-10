import { useEffect, useState, Fragment } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Check, Pencil, Trash2, History, FileText, Printer, Ruler, X, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { ordersApi, revisionsApi } from '../services/api'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'
import jsPDF from 'jspdf'
import { autoTable } from 'jspdf-autotable'

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

const STATUS_HEX = {
  'Confirmed': '#64748b',
  'Design Done': '#a855f7',
  'In Printing': '#3b82f6',
  'Printing Done': '#6366f1',
  'Delivery in Progress': '#f97316',
  'Delivered': '#22c55e',
  'Completed': '#10b981',
}

const statusHexColor = (s) => STATUS_HEX[s] || '#e2e8f0'

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [completeTyped, setCompleteTyped] = useState('')
  const [completePaymentMethod, setCompletePaymentMethod] = useState('')
  const [completeOnlineAmount, setCompleteOnlineAmount] = useState('')
  const [completeCashAmount, setCompleteCashAmount] = useState('')
  const [showRevisions, setShowRevisions] = useState(false)
  const [revisions, setRevisions] = useState([])
  const [loadingRevisions, setLoadingRevisions] = useState(false)
  const [generatingPdf, setGeneratingPdf] = useState(false)
  const [defectDescription, setDefectDescription] = useState('')
  const [updatingDefect, setUpdatingDefect] = useState(false)

  const fetchOrder = async () => {
    try {
      const o = await ordersApi.get(id)
      setOrder(o)
      setDefectDescription(o.defect_description || '')
    }
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
      window.dispatchEvent(new Event('orders-changed'))
      toast.success(`Order moved to "${newStatus}"`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const handleCompleteConfirm = async () => {
    if (completeTyped !== 'COMPLETE') return
    if (!completePaymentMethod) { toast.error('Select a payment method'); return }
    if (completePaymentMethod === 'Hybrid') {
      const online = Number(completeOnlineAmount || 0)
      const cash = Number(completeCashAmount || 0)
      if (online + cash !== Number(order.total_amount)) {
        toast.error(`Online + Cash must equal रु${Number(order.total_amount).toLocaleString()}`)
        return
      }
    }
    setShowCompleteModal(false)
    setCompleteTyped('')
    setUpdating(true)
    try {
      const payload = { confirm_text: 'COMPLETE', payment_method: completePaymentMethod }
      if (completePaymentMethod === 'Hybrid') {
        payload.online_amount = completeOnlineAmount
        payload.cash_amount = completeCashAmount
      }
      const updated = await ordersApi.updateStatus(id, 'Completed', payload)
      setOrder(updated)
      window.dispatchEvent(new Event('orders-changed'))
      toast.success('Order completed!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to complete order')
    } finally {
      setUpdating(false)
    }
  }

  const handleToggleDefective = async () => {
    if (updatingDefect) return
    const newVal = order.is_defective ? 0 : 1
    setUpdatingDefect(true)
    try {
      const updated = await ordersApi.updateDefect(id, { is_defective: newVal, defect_description: defectDescription || null })
      setOrder(updated)
      window.dispatchEvent(new Event('orders-changed'))
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update defect status')
    } finally {
      setUpdatingDefect(false)
    }
  }

  const handleSaveDefect = async () => {
    if (updatingDefect) return
    setUpdatingDefect(true)
    try {
      const updated = await ordersApi.updateDefect(id, { is_defective: order.is_defective, defect_description: defectDescription || null })
      setOrder(updated)
      window.dispatchEvent(new Event('orders-changed'))
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save defect description')
    } finally {
      setUpdatingDefect(false)
    }
  }

  const loadRevisions = async () => {
    setLoadingRevisions(true)
    try {
      const res = await revisionsApi.getByOrder(id)
      setRevisions(res)
    } catch { toast.error('Failed to load revisions') }
    finally { setLoadingRevisions(false) }
  }

  const handleShowRevisions = () => {
    setShowRevisions(true)
    loadRevisions()
  }

  const getLogoBase64 = () => {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      }
      img.onerror = () => resolve(null)
      img.src = '/Chhaap-Fav.png'
    })
  }

  const generatePdfBlob = async () => {
    const doc = new jsPDF()
    const pw = doc.internal.pageSize.getWidth()
    const ph = doc.internal.pageSize.getHeight()

    const logoData = await getLogoBase64()
    if (logoData) {
      doc.addImage(logoData, 'PNG', 14, 10, 20, 20)
    }

    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(60)
    doc.text('Chhaap Creatives Pvt. Ltd.', 38, 16)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100)
    doc.text('9744957686', 38, 22)
    doc.text('contact.chhaapcreatives@gmail.com', 38, 28)
    doc.text('Jorpati, Gokarneshwor-5, Kathmandu', 38, 34)
    doc.setTextColor(0)

    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('INVOICE', pw - 14, 22, { align: 'right' })

    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100)
    doc.text(`Invoice #: INV-${String(order.id).padStart(4, '0')}`, pw - 14, 36, { align: 'right' })
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString('en-IN')}`, pw - 14, 42, { align: 'right' })
    if (order.deadline) {
      doc.text(`Deadline: ${new Date(order.deadline).toLocaleDateString('en-IN')}`, pw - 14, 48, { align: 'right' })
    }

    doc.setDrawColor(148, 34, 34)
    doc.setLineWidth(0.5)
    doc.line(14, 54, pw - 14, 54)

    doc.setTextColor(0)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Bill To:', 14, 64)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(order.customer_name, 14, 71)
    doc.text(order.customer_phone, 14, 77)
    if (order.customer_address) {
      doc.text(order.customer_address, 14, 83)
    }

    doc.setDrawColor(200)
    doc.setLineWidth(0.3)
    doc.line(14, 90, pw - 14, 90)

    const dimStr = (item) => item.length ? ` (${item.length}x${item.breadth} ${item.unit})` : ''
    const tableBody = order.items.map((item, i) => [
      i + 1,
      `${item.product_name}${dimStr(item)}`,
      item.quantity,
      `Rs ${Number(item.sold_price).toLocaleString('en-IN')}`,
      `Rs ${(Number(item.sold_price) * item.quantity).toLocaleString('en-IN')}`,
    ])

    autoTable(doc, {
      startY: 96,
      head: [['#', 'Description', 'Qty', 'Rate', 'Amount']],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [148, 34, 34], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: { 0: { cellWidth: 10, halign: 'center' }, 2: { halign: 'center' }, 3: { halign: 'right' }, 4: { halign: 'right' } },
    })

    const fy = doc.lastAutoTable.finalY + 10

    doc.setDrawColor(148, 34, 34)
    doc.setLineWidth(0.5)
    doc.line(pw - 80, fy, pw - 14, fy)

    const lineH = 7
    let ly = fy + 4

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Total Amount:', pw - 80, ly)
    doc.setFont('helvetica', 'normal')
    doc.text(`Rs ${Number(order.total_amount).toLocaleString('en-IN')}`, pw - 14, ly, { align: 'right' })
    ly += lineH

    if (Number(order.advance_payment) > 0) {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(148, 34, 34)
      doc.text('Advance Paid:', pw - 80, ly)
      doc.setFont('helvetica', 'normal')
      doc.text(`-Rs ${Number(order.advance_payment).toLocaleString('en-IN')}`, pw - 14, ly, { align: 'right' })
      ly += lineH

      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0)
      doc.text('Balance Due:', pw - 80, ly)
      doc.text(`Rs ${Math.max(0, Number(order.total_amount) - Number(order.advance_payment)).toLocaleString('en-IN')}`, pw - 14, ly, { align: 'right' })
      ly += lineH
    }

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(150)
    const footerY = ph - 14
    doc.text('Thank you for your business!', pw / 2, footerY, { align: 'center' })
    doc.text('Chhaap Creatives Pvt. Ltd. | Jorpati, Gokarneshwor-5, Kathmandu | 9744957686 | contact.chhaapcreatives@gmail.com', pw / 2, footerY + 4, { align: 'center' })

    return doc.output('blob')
  }

  const handleDownloadInvoice = async () => {
    setGeneratingPdf(true)
    try {
      const blob = await generatePdfBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Invoice-Order#${order.id}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Invoice downloaded')
    } catch { toast.error('Failed to generate invoice') }
    finally { setGeneratingPdf(false) }
  }

  const handlePrintInvoice = async () => {
    setGeneratingPdf(true)
    try {
      const blob = await generatePdfBlob()
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
    } catch { toast.error('Failed to generate invoice') }
    finally { setGeneratingPdf(false) }
  }

  const handleDelete = async () => {
    try {
      await ordersApi.delete(id)
      toast.success(`Order #${id} deleted`)
      window.dispatchEvent(new Event('orders-changed'))
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
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/orders" className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 truncate">Order #{order.id}</h1>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <>
            <button onClick={handleDownloadInvoice} disabled={generatingPdf}
              className="px-2 md:px-3 py-2 text-sm text-emerald-600 border border-emerald-300 rounded-lg hover:bg-emerald-50 font-medium flex items-center gap-1">
              <FileText className="w-4 h-4" /> {generatingPdf ? '...' : <span className="hidden sm:inline">Download</span>}
            </button>
            <button onClick={handlePrintInvoice} disabled={generatingPdf}
              className="px-2 md:px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 font-medium flex items-center gap-1">
              <Printer className="w-4 h-4" /> {generatingPdf ? '...' : <span className="hidden sm:inline">Print</span>}
            </button>
          </>
          {!isCompleted && (
            <>
              <button onClick={handleShowRevisions}
                className="px-2 md:px-3 py-2 text-sm text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50 font-medium flex items-center gap-1">
                <History className="w-4 h-4" /> <span className="hidden sm:inline">History</span>
              </button>
              <button onClick={() => setShowDelete(true)}
                className="px-2 md:px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 font-medium flex items-center gap-1">
                <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Delete</span>
              </button>
              <Link to={`/orders/${id}/edit`} className="px-2 md:px-3 py-2 text-sm text-cyan-600 border border-cyan-300 rounded-lg hover:bg-cyan-50 font-medium flex items-center gap-1">
                <Pencil className="w-4 h-4" /> <span className="hidden sm:inline">Edit</span>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
        <h2 className="font-semibold text-slate-700 mb-4">Status Pipeline</h2>
        <div className="overflow-x-auto pt-1 pb-2 -mx-4 md:mx-0 px-4 md:px-0">
          <div className="flex items-start min-w-[640px]">
            {STATUSES.map((s, i) => {
              const clickable = !isCompleted && s !== order.status
              const done = i < currentIdx
              const active = i === currentIdx
              return (
                <Fragment key={s}>
                  <div className="flex flex-col items-center shrink-0" style={{ width: '72px' }}>
                    <button type="button"
                      onClick={() => clickable && handleStatusChange(s)}
                      disabled={!clickable}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0
                        ${done ? `${STATUS_COLORS[s]} text-white` :
                          active ? `${STATUS_COLORS[s]} text-white ring-4 ring-cyan-200` :
                          'bg-slate-200 text-slate-500'}
                        ${clickable ? 'cursor-pointer hover:ring-2 hover:ring-cyan-300' : 'cursor-default'}`}>
                      {done ? <Check className="w-4 h-4" /> : i + 1}
                    </button>
                    <div className={`text-[10px] md:text-xs mt-2 text-center font-medium leading-tight px-1 ${done || active ? 'text-slate-800' : 'text-slate-400'}`}>
                      {s}
                    </div>
                  </div>
                  {i < STATUSES.length - 1 && (
                    <div
                      className="flex-1 h-1 mt-3.5 rounded-full transition-colors"
                      style={{ backgroundColor: i < currentIdx ? undefined : '#e2e8f0' }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: i < currentIdx ? '100%' : '0%',
                          backgroundColor: i < currentIdx ? statusHexColor(STATUSES[i]) : 'transparent',
                        }}
                      />
                    </div>
                  )}
                </Fragment>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
          <h2 className="font-semibold text-slate-700 mb-3">Customer Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Name</span><span className="font-medium">{order.customer_name}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Phone</span><span className="font-medium">{order.customer_phone}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Address</span><span className="font-medium text-right max-w-[200px]">{order.customer_address}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Total Amount</span><span className="font-bold text-lg">रु{Number(order.total_amount).toLocaleString()}</span></div>
            {Number(order.advance_payment) > 0 && (
              <div className="flex justify-between"><span className="text-slate-500">Advance Paid</span>
                <span className="font-medium text-green-600">रु{Number(order.advance_payment).toLocaleString()}</span>
              </div>
            )}
            {Number(order.advance_payment) > 0 && !isCompleted && (
              <div className="flex justify-between"><span className="text-slate-500">Balance Due</span>
                <span className="font-medium text-orange-600">रु{Math.max(0, Number(order.total_amount) - Number(order.advance_payment)).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between"><span className="text-slate-500">Payment</span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                order.payment_status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>{order.payment_status === 'Pending' && Number(order.advance_payment) > 0 && !isCompleted ? 'Advance Paid' : order.payment_status}</span>
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
            {order.order_source && <div className="flex justify-between"><span className="text-slate-500">Source</span><span className="font-medium">{order.order_source}{order.platform_handle ? ` (${order.platform_handle})` : ''}</span></div>}
            {order.payment_method && (
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Method</span>
                <span className="font-medium capitalize">{order.payment_method.replace('_', ' ')}{order.payment_method === 'Hybrid' && order.online_amount ? <span className="text-xs text-slate-400 ml-1">(Online: रु{Number(order.online_amount).toLocaleString()} | Cash: रु{Number(order.cash_amount).toLocaleString()})</span> : ''}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-sm flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-red-500" /> Defective</span>
                <button onClick={handleToggleDefective}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${order.is_defective ? 'bg-red-500' : 'bg-slate-300'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${order.is_defective ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              {order.is_defective && (
                <textarea value={defectDescription} onChange={e => setDefectDescription(e.target.value)} onBlur={handleSaveDefect}
                  placeholder="Describe the defect..." rows={2} maxLength={500}
                  className="mt-2 w-full px-3 py-2 border border-red-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
              )}
            </div>
            {order.notes && (
              <div className="pt-2 border-t border-slate-200 mt-2">
                <span className="text-slate-500 text-xs block mb-1">Order Notes</span>
                <span className="font-medium text-sm">{order.notes}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
          <h2 className="font-semibold text-slate-700 mb-3">Order Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[300px]">
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
                    <td className="py-2 font-medium text-slate-700">
                      {item.product_name}
                      {item.length && <span className="ml-1 text-xs text-orange-500"><Ruler className="w-3 h-3 inline" /> {item.length}×{item.breadth}{item.unit === 'feet' ? 'ft' : '"'}</span>}
                    </td>
                    <td className="py-2 text-center text-slate-600">{item.quantity}</td>
                    <td className="py-2 text-right text-slate-600">रु{Number(item.sold_price).toLocaleString()}</td>
                    <td className="py-2 text-right font-medium text-slate-700">रु{(Number(item.sold_price) * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => { setShowCompleteModal(false); setCompleteTyped(''); setCompletePaymentMethod('') }}>
          <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-sm mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Complete Order #{order.id}?</h2>
            <p className="text-sm text-slate-600 mb-4">
              Once completed, this order will count toward revenue and cannot be changed.
            </p>

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
              <button onClick={() => { setShowCompleteModal(false); setCompleteTyped(''); setCompletePaymentMethod('') }}
                className="px-4 py-2.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showRevisions && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowRevisions(false)}>
          <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Revision History</h2>
              <button onClick={() => setShowRevisions(false)} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            {loadingRevisions ? <p className="text-sm text-slate-400">Loading...</p> :
              revisions.length === 0 ? <p className="text-sm text-slate-400">No revisions recorded yet.</p> : (
                <div className="space-y-3">
                  {revisions.map(r => (
                    <div key={r.id} className="p-3 bg-slate-50 rounded-lg text-sm">
                      <p className="text-slate-700">{r.diff_summary}</p>
                      <p className="text-xs text-slate-400 mt-1">{new Date(r.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
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
