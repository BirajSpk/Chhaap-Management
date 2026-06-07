import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Plus, Trash2, X, FileText, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { productsApi, ordersApi } from '../services/api'

export default function NewOrder() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [advancePayment, setAdvancePayment] = useState('')
  const [deadline, setDeadline] = useState('')
  const [items, setItems] = useState([{ product_id: '', quantity: 1, sold_price: '', cost_price: '' }])
  const [productSearch, setProductSearch] = useState({})
  const [showConfirm, setShowConfirm] = useState(false)
  const [showCost, setShowCost] = useState({})

  useEffect(() => {
    productsApi.list().then(setProducts).catch(() => toast.error('Failed to load products'))
  }, [])

  const filteredProducts = (searchTerm) =>
    products.filter(p =>
      p.name.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
      p.sku.toLowerCase().includes((searchTerm || '').toLowerCase())
    )

  const handleProductSelect = (idx, product) => {
    const newItems = [...items]
    newItems[idx] = {
      product_id: product.id,
      quantity: 1,
      sold_price: product.selling_price,
      cost_price: product.cost_price,
    }
    setItems(newItems)
    setProductSearch({ ...productSearch, [idx]: '' })
  }

  const addItem = () => {
    setItems([...items, { product_id: '', quantity: 1, sold_price: '', cost_price: '' }])
  }

  const addCustomItem = () => {
    setItems([...items, { is_custom: true, custom_item_name: '', quantity: 1, sold_price: '', cost_price: '' }])
  }

  const removeItem = (idx) => {
    if (items.length === 1) return
    setItems(items.filter((_, i) => i !== idx))
  }

  const updateItem = (idx, field, value) => {
    const newItems = [...items]
    newItems[idx][field] = value
    setItems(newItems)
  }

  const toggleCost = (idx) => {
    setShowCost(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  const total = items.reduce((sum, item) => sum + (Number(item.sold_price) || 0) * (Number(item.quantity) || 0), 0)

  const validate = () => {
    if (!customerName) { toast.error('Customer name required'); return false }
    if (!customerPhone) { toast.error('Customer phone required'); return false }
    if (!customerAddress) { toast.error('Customer address required'); return false }
    if (!items.some(i => i.is_custom || i.product_id)) { toast.error('Add at least one product'); return false }
    if (items.some(i => i.is_custom && !i.custom_item_name)) { toast.error('Custom item needs a description'); return false }
    return true
  }

  const handleConfirm = async () => {
    try {
      const order = await ordersApi.create({
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        notes: notes || undefined,
        advance_payment: Number(advancePayment || 0),
        deadline: deadline || undefined,
        items: items.map(i => ({
          ...(i.is_custom
            ? { is_custom: true, custom_item_name: i.custom_item_name }
            : { product_id: Number(i.product_id) }
          ),
          quantity: Number(i.quantity),
          sold_price: Number(i.sold_price),
          cost_price: Number(i.cost_price || 0),
        })),
      })
      toast.success(`Order #${order.id} created`)
      setShowConfirm(false)
      navigate(`/orders/${order.id}`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create order')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setShowConfirm(true)
  }

  const selectedProduct = (id) => products.find(p => p.id === Number(id))

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/orders" className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">New Order</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <h2 className="font-semibold text-slate-700">Customer Details</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Name *</label>
              <input value={customerName} onChange={e => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Phone *</label>
              <input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Address *</label>
            <textarea value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Advance Payment (₹)</label>
              <input type="number" min="0" value={advancePayment} onChange={e => setAdvancePayment(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Deadline</label>
              <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Order Notes / Design Brief</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Optional notes about this order..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-700">Products</h2>
            <div className="flex gap-2">
              <button type="button" onClick={addCustomItem} className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-medium">
                <FileText className="w-4 h-4" /> Custom Item
              </button>
              <button type="button" onClick={addItem} className="flex items-center gap-1 text-sm text-cyan-600 hover:text-cyan-700 font-medium">
                <Plus className="w-4 h-4" /> Add Row
              </button>
            </div>
          </div>

          {items.map((item, idx) => (
            <div key={idx} className="flex gap-2 items-start p-3 bg-slate-50 rounded-lg">
              <div className="flex-1 relative">
                {item.is_custom ? (
                  <input placeholder="Describe custom item..."
                    value={item.custom_item_name || ''}
                    onChange={e => updateItem(idx, 'custom_item_name', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                ) : item.product_id ? (
                  <div className="flex items-center justify-between px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm">
                    <span>{selectedProduct(item.product_id)?.name}</span>
                    <button type="button" onClick={() => updateItem(idx, 'product_id', '')} className="text-red-500 text-xs">Change</button>
                  </div>
                ) : (
                  <div>
                    <input placeholder="Search products..."
                      value={productSearch[idx] || ''}
                      onChange={e => setProductSearch({ ...productSearch, [idx]: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    {(productSearch[idx] || '') && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredProducts(productSearch[idx]).map(p => (
                          <button key={p.id} type="button" onClick={() => handleProductSelect(idx, p)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 border-b border-slate-100 last:border-0">
                            <span className="font-medium">{p.name}</span>
                            <span className="text-slate-400 ml-2">({p.sku})</span>
                            <span className="text-slate-500 ml-2">₹{p.selling_price}</span>
                          </button>
                        ))}
                        {filteredProducts(productSearch[idx]).length === 0 && (
                          <div className="px-3 py-2 text-sm text-slate-400">No products found</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="w-20">
                <label className="block text-xs text-slate-500 mb-1">Qty</label>
                <input type="number" min="1" value={item.quantity}
                  onChange={e => updateItem(idx, 'quantity', e.target.value)}
                  className="w-full px-2 py-2 border border-slate-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
              <div className="w-28">
                <label className="block text-xs text-slate-500 mb-1">Cost Price (₹)</label>
                <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                  <input type={showCost[idx] ? 'number' : 'text'}
                    value={showCost[idx] ? item.cost_price : '***'}
                    onChange={e => updateItem(idx, 'cost_price', e.target.value)}
                    readOnly={!showCost[idx]}
                    className="w-full px-2 py-2 text-sm text-right focus:outline-none bg-transparent" />
                  <button type="button" onClick={() => toggleCost(idx)} className="px-1 text-slate-400 hover:text-slate-600">
                    {showCost[idx] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="w-28">
                <label className="block text-xs text-slate-500 mb-1">Selling Price (₹)</label>
                <input type="number" value={item.sold_price}
                  onChange={e => updateItem(idx, 'sold_price', e.target.value)}
                  className="w-full px-2 py-2 border border-slate-300 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
              <button type="button" onClick={() => removeItem(idx)} className="mt-5 p-2 text-red-500 hover:bg-red-50 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <div className="text-right text-lg font-bold text-slate-800 pt-2 border-t border-slate-200">
            Total: ₹{total.toLocaleString()}
          </div>
        </div>

        <button type="submit" className="w-full py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 font-medium">
          Create Order
        </button>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Confirm Order</h2>
              <button onClick={() => setShowConfirm(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-600 mb-4 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Please confirm the order details with the customer before proceeding.
            </p>

            <div className="space-y-2 text-sm mb-4">
              <div><span className="text-slate-500">Customer:</span> <span className="font-medium">{customerName}</span></div>
              <div><span className="text-slate-500">Phone:</span> <span className="font-medium">{customerPhone}</span></div>
              <div><span className="text-slate-500">Address:</span> <span className="font-medium">{customerAddress}</span></div>
              {Number(advancePayment) > 0 && <div><span className="text-slate-500">Advance Paid:</span> <span className="font-medium text-green-600">₹{Number(advancePayment).toLocaleString()}</span></div>}
              {deadline && <div><span className="text-slate-500">Deadline:</span> <span className="font-medium">{new Date(deadline).toLocaleDateString()}</span></div>}
              {notes && <div><span className="text-slate-500">Notes:</span> <span className="font-medium">{notes}</span></div>}
            </div>

            <table className="w-full text-sm mb-4">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left pb-2 font-medium text-slate-500">Product</th>
                  <th className="text-center pb-2 font-medium text-slate-500">Qty</th>
                  <th className="text-right pb-2 font-medium text-slate-500">Cost</th>
                  <th className="text-right pb-2 font-medium text-slate-500">Price</th>
                  <th className="text-right pb-2 font-medium text-slate-500">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.filter(i => i.is_custom || i.product_id).map((item, idx) => {
                  const p = selectedProduct(item.product_id)
                  const name = item.is_custom ? `Custom: ${item.custom_item_name}` : p?.name
                  return (
                    <tr key={idx} className="border-b border-slate-100">
                      <td className="py-2 text-slate-700">{name}</td>
                      <td className="py-2 text-center text-slate-600">{item.quantity}</td>
                      <td className="py-2 text-right text-slate-600">₹{Number(item.cost_price || 0).toLocaleString()}</td>
                      <td className="py-2 text-right text-slate-600">₹{Number(item.sold_price).toLocaleString()}</td>
                      <td className="py-2 text-right font-medium text-slate-700">₹{(Number(item.sold_price) * Number(item.quantity)).toLocaleString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div className="text-right text-lg font-bold text-slate-800 mb-4">Total: ₹{total.toLocaleString()}</div>

            <div className="flex gap-3">
              <button onClick={handleConfirm} className="flex-1 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 font-medium text-sm">
                Confirm & Create Order
              </button>
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
