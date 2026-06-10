import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Plus, Trash2, X, ArrowLeft, FileText, Eye, EyeOff, UserPlus, Ruler, Camera, MessageCircle, Music2, Phone, Store, Globe, Wifi, Banknote } from 'lucide-react'
import toast from 'react-hot-toast'
import { productsApi, ordersApi, customersApi } from '../services/api'

const SOURCE_ICONS = { Instagram: Camera, Messenger: MessageCircle, TikTok: Music2, 'WhatsApp': Phone, 'In-Store': Store, 'Phone Call': Phone, External: Globe }
const SOURCES = ['Instagram', 'Messenger', 'TikTok', 'WhatsApp', 'In-Store', 'Phone Call', 'External']

export default function EditOrder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const sanitizePhone = (v) => v.replace(/[^0-9+\-\s()]/g, '').slice(0, 20)
  const [customerAddress, setCustomerAddress] = useState('')
  const [customerId, setCustomerId] = useState(null)
  const [notes, setNotes] = useState('')
  const [advancePayment, setAdvancePayment] = useState('')
  const [deadline, setDeadline] = useState('')
  const [orderSource, setOrderSource] = useState('')
  const [platformHandle, setPlatformHandle] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [onlineAmount, setOnlineAmount] = useState('')
  const [cashAmount, setCashAmount] = useState('')
  const [items, setItems] = useState([])
  const [productSearch, setProductSearch] = useState({})
  const [showConfirm, setShowConfirm] = useState(false)
  const [showCost, setShowCost] = useState({})
  const [customerResults, setCustomerResults] = useState([])
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)
  const [searching, setSearching] = useState(false)
  const [showQuickProduct, setShowQuickProduct] = useState(false)
  const [quickEditId, setQuickEditId] = useState(null)
  const [quickForm, setQuickForm] = useState({ name: '', cost_price: '', selling_price: '', is_dimension: false, sqft_cost_price: '', sqft_selling_price: '' })
  const customerDebounce = useRef(null)

  useEffect(() => {
    Promise.all([
      productsApi.list(),
      ordersApi.get(id),
    ]).then(([prodData, order]) => {
      setProducts(prodData)
      setCustomerName(order.customer_name)
      setCustomerPhone(order.customer_phone)
      setCustomerAddress(order.customer_address)
      setCustomerId(order.customer_id || null)
      setNotes(order.notes || '')
      setAdvancePayment(order.advance_payment || '')
      setDeadline(order.deadline || '')
      setOrderSource(order.order_source || '')
      setPlatformHandle(order.platform_handle || '')
      setPaymentMethod(order.payment_method || '')
      setOnlineAmount(order.online_amount || '')
      setCashAmount(order.cash_amount || '')
      setItems(order.items.map(i => ({
        product_id: i.product_id,
        quantity: i.quantity,
        sold_price: i.sold_price,
        cost_price: i.cost_price,
        is_custom: !i.product_id && i.custom_item_name ? true : false,
        custom_item_name: i.custom_item_name || '',
        is_dimension: !!(i.length || i.breadth || i.unit),
        length: i.length || '',
        breadth: i.breadth || '',
        unit: i.unit || 'inches',
      })))
    }).catch(() => toast.error('Failed to load order'))
      .finally(() => setLoading(false))
  }, [id])

  const handleInlineCustomerSearch = useCallback((q, field) => {
    if (customerDebounce.current) clearTimeout(customerDebounce.current)
    if (q.length < 1) { setCustomerResults([]); setShowCustomerDropdown(false); return }
    customerDebounce.current = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await customersApi.search(q, field)
        setCustomerResults(res)
        setShowCustomerDropdown(true)
      } catch { /* ignore */ }
      finally { setSearching(false) }
    }, 300)
  }, [])

  const selectCustomer = (c) => { setCustomerId(c.id); setCustomerName(c.name); setCustomerPhone(c.phone); setCustomerAddress(c.address || ''); setShowCustomerDropdown(false) }

  const filteredProducts = useCallback((searchTerm) =>
    products.filter(p => p.name.toLowerCase().includes((searchTerm || '').toLowerCase()) || p.sku.toLowerCase().includes((searchTerm || '').toLowerCase())),
  [products])

  const handleProductSelect = (idx, product) => {
    const newItems = [...items]
    const isDim = product.is_dimension_product == 1
    newItems[idx] = { product_id: product.id, quantity: 1, sold_price: product.selling_price, cost_price: product.cost_price, is_dimension: isDim, length: isDim ? '' : null, breadth: isDim ? '' : null, unit: isDim ? 'inches' : null }
    setItems(newItems); setProductSearch({ ...productSearch, [idx]: '' })
  }

  const handleProductSelectDim = (idx, product) => {
    const newItems = [...items]
    if (product.is_dimension_product) { newItems[idx] = { product_id: product.id, quantity: 1, sold_price: 0, cost_price: 0, is_dimension: true, length: '', breadth: '', unit: 'inches' } }
    setItems(newItems); setProductSearch({ ...productSearch, [idx]: '' })
  }

  const updateDimensionCalc = (idx, item) => {
    if (!item.product_id || !item.length || !item.breadth) return
    const p = products.find(x => x.id === Number(item.product_id))
    if (!p?.is_dimension_product) return
    const l = Number(item.length); const b = Number(item.breadth)
    const div = item.unit === 'inches' ? 144 : 1
    const sqft = (l * b) / div
    const newItems = [...items]
    newItems[idx].sold_price = (sqft * Number(p.sqft_selling_price || 0)).toFixed(2)
    newItems[idx].cost_price = (sqft * Number(p.sqft_cost_price || 0)).toFixed(2)
    setItems(newItems)
  }

  const addItem = () => { setItems([...items, { product_id: '', quantity: 1, sold_price: '', cost_price: '', is_dimension: false, length: '', breadth: '', unit: 'inches' }]) }
  const addCustomItem = () => { setItems([...items, { is_custom: true, custom_item_name: '', quantity: 1, sold_price: '', cost_price: '' }]) }
  const addDimensionItem = () => { setItems([...items, { product_id: '', quantity: 1, sold_price: 0, cost_price: 0, is_dimension: true, length: '', breadth: '', unit: 'inches' }]) }
  const removeItem = (idx) => { if (items.length === 1) return; setItems(items.filter((_, i) => i !== idx)) }

  const updateItem = (idx, field, value) => {
    const newItems = [...items]
    newItems[idx][field] = value; setItems(newItems)
    if (['length', 'breadth', 'unit', 'product_id'].includes(field) && newItems[idx].is_dimension) {
      setTimeout(() => updateDimensionCalc(idx, newItems[idx]), 0)
    }
  }

  const toggleCost = (idx) => setShowCost(prev => ({ ...prev, [idx]: !prev[idx] }))

  const total = useMemo(() => items.reduce((sum, item) => sum + (Number(item.sold_price) || 0) * (Number(item.quantity) || 0), 0), [items])

  const validate = () => {
    if (!customerName) { toast.error('Customer name required'); return false }
    if (!customerPhone) { toast.error('Customer phone required'); return false }
    if (!customerAddress) { toast.error('Customer address required'); return false }
    if (!items.some(i => i.is_custom || i.product_id)) { toast.error('Add at least one product'); return false }
    if (items.some(i => i.is_custom && !i.custom_item_name)) { toast.error('Custom item needs a description'); return false }
    if (paymentMethod === 'Hybrid') {
      const onAmt = Number(onlineAmount || 0); const cAmt = Number(cashAmount || 0)
      if (onAmt + cAmt !== Number(advancePayment || 0)) { toast.error('Online + Cash amounts must equal advance payment'); return false }
    }
    return true
  }

  const handleQuickAddProduct = async () => {
    if (!quickForm.name) { toast.error('Product name required'); return }
    try {
      const payload = {
        name: quickForm.name, cost_price: Number(quickForm.cost_price || 0), selling_price: Number(quickForm.selling_price || 0),
        is_dimension_product: quickForm.is_dimension ? 1 : 0,
        sqft_cost_price: quickForm.is_dimension ? Number(quickForm.sqft_cost_price || 0) : 0,
        sqft_selling_price: quickForm.is_dimension ? Number(quickForm.sqft_selling_price || 0) : 0,
      }
      if (quickEditId) {
        await productsApi.update(quickEditId, payload)
        toast.success('Product updated')
      } else {
        await productsApi.create(payload)
        toast.success('Product created')
      }
      setShowQuickProduct(false); setQuickEditId(null)
      setQuickForm({ name: '', cost_price: '', selling_price: '', is_dimension: false, sqft_cost_price: '', sqft_selling_price: '' })
      setProducts(await productsApi.list())
    } catch (err) {
      if (err.response?.status === 409 && err.response?.data?.existing) {
        const ex = err.response.data.existing
        setQuickEditId(ex.id)
        setQuickForm({
          name: ex.name, cost_price: ex.cost_price, selling_price: ex.selling_price,
          is_dimension: ex.is_dimension_product == 1,
          sqft_cost_price: ex.sqft_cost_price, sqft_selling_price: ex.sqft_selling_price,
        })
        toast.success('Loaded existing product — adjust pricing and save')
      } else {
        toast.error(err.response?.data?.error || 'Failed')
      }
    }
  }

  const handleConfirm = async () => {
    try {
      await ordersApi.update(id, {
        customer_name: customerName, customer_phone: customerPhone, customer_address: customerAddress,
        customer_id: customerId || undefined, notes: notes || undefined,
        advance_payment: Number(advancePayment || 0), deadline: deadline || undefined,
        order_source: orderSource || undefined, platform_handle: platformHandle || undefined,
        payment_method: paymentMethod || undefined,
        online_amount: paymentMethod === 'Hybrid' ? Number(onlineAmount || 0) : undefined,
        cash_amount: paymentMethod === 'Hybrid' ? Number(cashAmount || 0) : undefined,
        items: items.filter(i => i.is_custom || i.product_id).map(i => {
          const base = i.is_custom ? { is_custom: true, custom_item_name: i.custom_item_name } : { product_id: Number(i.product_id) }
          if (i.is_dimension) { base.length = Number(i.length) || null; base.breadth = Number(i.breadth) || null; base.unit = i.unit || null }
          return { ...base, quantity: Number(i.quantity), sold_price: Number(i.sold_price), cost_price: Number(i.cost_price || 0) }
        }),
      })
      toast.success(`Order #${id} updated`)
      setShowConfirm(false)
      window.dispatchEvent(new Event('orders-changed'))
      navigate(`/orders/${id}`)
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to update order') }
  }

  const handleSubmit = (e) => { e.preventDefault(); if (!validate()) return; setShowConfirm(true) }

  const selectedProduct = (id) => products.find(p => p.id === Number(id))

  if (loading) return <div className="p-6 text-slate-500">Loading...</div>

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link to={`/orders/${id}`} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Edit Order #{id}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
          <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5 space-y-3">
            <h2 className="font-semibold text-slate-700">Customer Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Name *</label>
                <input value={customerName}
                  onChange={e => { setCustomerName(e.target.value); handleInlineCustomerSearch(e.target.value, 'name') }}
                  onFocus={() => customerName.length >= 1 && setShowCustomerDropdown(true)}
                  onBlur={() => setTimeout(() => setShowCustomerDropdown(false), 200)}
                  placeholder="Start typing to search..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Phone *</label>
                <input type="tel" inputMode="tel" maxLength={20} value={customerPhone}
                  onChange={e => { const v = sanitizePhone(e.target.value); setCustomerPhone(v); handleInlineCustomerSearch(v, 'phone') }}
                  onKeyDown={e => { if (/[a-zA-Z]/.test(e.key) && e.key.length === 1) e.preventDefault() }}
                  onFocus={() => customerPhone.length >= 1 && setShowCustomerDropdown(true)}
                  onBlur={() => setTimeout(() => setShowCustomerDropdown(false), 200)}
                  placeholder="Start typing to search..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
              </div>
              {showCustomerDropdown && (
                <div className="absolute z-20 top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {searching ? <div className="px-3 py-2 text-sm text-slate-400">Searching...</div> :
                    customerResults.length === 0 ? (
                      <button type="button" onMouseDown={() => { setShowCustomerDropdown(false) }}
                        className="w-full text-left px-3 py-2 text-sm text-cyan-600 hover:bg-slate-50 font-medium flex items-center gap-2">
                        <UserPlus className="w-4 h-4" />+ Create New
                      </button>
                    ) : (
                      <>
                        {customerResults.map(c => (
                          <button key={c.id} type="button" onMouseDown={() => selectCustomer(c)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 border-b border-slate-100 last:border-0">
                            <span className="font-medium">{c.name}</span><span className="text-slate-400 ml-2">{c.phone}</span>
                          </button>
                        ))}
                      </>
                    )}
                </div>
              )}
            </div>
            <div><label className="block text-sm font-medium text-slate-600 mb-1">Address *</label>
              <textarea value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} rows={2} required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none" /></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-slate-600 mb-1">Advance Payment (रु)</label>
              <input type="number" min="0" value={advancePayment} onChange={e => setAdvancePayment(e.target.value)} placeholder="0"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
            <div><label className="block text-sm font-medium text-slate-600 mb-1">Deadline</label>
              <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Order Source</label>
            <div className="flex flex-wrap gap-1.5">
              {SOURCES.map(s => {
                const Icon = SOURCE_ICONS[s]; const isActive = orderSource === s
                return (
                  <button key={s} type="button" onClick={() => setOrderSource(isActive ? '' : s)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isActive ? 'bg-cyan-50 border-cyan-300 text-cyan-700' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
                    {Icon && <Icon className="w-3.5 h-3.5" />}{s === 'Phone Call' ? 'Phone' : s}</button>
                )
              })}
            </div>
            {orderSource && ['Instagram', 'Messenger', 'TikTok', 'WhatsApp'].includes(orderSource) && (
              <input value={platformHandle} onChange={e => setPlatformHandle(e.target.value)} placeholder={`${orderSource} username/handle...`}
                className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Payment Method</label>
            <div className="flex flex-wrap gap-1.5">
              {['QR', 'COD', 'Physical Cash', 'Hybrid'].map(m => {
                const isActive = paymentMethod === m
                const Icon = m === 'QR' || m === 'COD' ? Wifi : m === 'Physical Cash' ? Banknote : null
                return (
                  <button key={m} type="button" onClick={() => setPaymentMethod(isActive ? '' : m)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isActive ? 'bg-cyan-50 border-cyan-300 text-cyan-700' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
                    {Icon && <Icon className="w-3.5 h-3.5" />}{m === 'Physical Cash' ? 'Cash' : m}</button>
                )
              })}
            </div>
            {paymentMethod === 'Hybrid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Online Amount (रु)</label>
                  <input type="number" min="0" value={onlineAmount} onChange={e => setOnlineAmount(e.target.value)} placeholder="0"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Cash Amount (रु)</label>
                  <input type="number" min="0" value={cashAmount} onChange={e => setCashAmount(e.target.value)} placeholder="0"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" /></div>
              </div>
            )}
          </div>

          <div><label className="block text-sm font-medium text-slate-600 mb-1">Order Notes / Design Brief</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Optional notes..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none" /></div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-semibold text-slate-700">Products</h2>
            <div className="flex gap-2 text-sm">
              <button type="button" onClick={addDimensionItem} className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium">
                <Ruler className="w-4 h-4" /> <span className="hidden sm:inline">SqFt</span></button>
              <button type="button" onClick={addCustomItem} className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium">
                <FileText className="w-4 h-4" /> <span className="hidden sm:inline">Custom</span></button>
              <button type="button" onClick={addItem} className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700 font-medium">
                <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Product</span></button>
            </div>
          </div>

          {items.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-2 p-3 bg-slate-50 rounded-lg">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  {item.is_custom ? (
                    <input placeholder="Describe custom item..." value={item.custom_item_name || ''}
                      onChange={e => updateItem(idx, 'custom_item_name', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  ) : item.product_id ? (
                    <div className="flex items-center justify-between px-3 py-2 bg-white border rounded-lg text-sm">
                      <span className="truncate">{selectedProduct(item.product_id)?.name}</span>
                      <button type="button" onClick={() => updateItem(idx, 'product_id', '')} className="text-red-500 text-xs shrink-0 ml-2">Change</button>
                    </div>
                  ) : (
                    <div>
                      <input placeholder="Search products..." value={productSearch[idx] || ''}
                        onChange={e => setProductSearch({ ...productSearch, [idx]: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                      {(productSearch[idx] || '') && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {filteredProducts(productSearch[idx]).map(p => (
                            <button key={p.id} type="button"
                              onClick={() => p.is_dimension_product ? handleProductSelectDim(idx, p) : handleProductSelect(idx, p)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 border-b border-slate-100 last:border-0">
                              <span className="font-medium">{p.name}</span><span className="text-slate-400 ml-2">({p.sku})</span>
                              <span className="text-slate-500 ml-2">रु{p.selling_price}</span>
                              {p.is_dimension_product == 1 && <span className="ml-1 text-orange-500 text-xs">(sqft)</span>}
                            </button>
                          ))}
                          <button type="button" onClick={() => { setShowQuickProduct(true); setQuickEditId(null); setProductSearch({ ...productSearch, [idx]: '' }) }}
                            className="w-full text-left px-3 py-2 text-sm text-cyan-600 hover:bg-cyan-50 font-medium flex items-center gap-2 border-t border-slate-200">
                            <Plus className="w-4 h-4" />+ Quick Add Product</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 items-center">
                  <div className="w-16">
                    <label className="block text-xs text-slate-500 mb-1">Qty</label>
                    <input type="number" min="1" value={item.quantity}
                      onChange={e => updateItem(idx, 'quantity', e.target.value)}
                      className="w-full px-2 py-2 border border-slate-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs text-slate-500 mb-1">Cost</label>
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
                  <div className="w-24">
                    <label className="block text-xs text-slate-500 mb-1">Sell</label>
                    <input type="number" value={item.sold_price}
                      onChange={e => updateItem(idx, 'sold_price', e.target.value)}
                      className="w-full px-2 py-2 border border-slate-300 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                  </div>
                  <button type="button" onClick={() => removeItem(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded shrink-0 mt-4"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              {item.is_dimension && (
                <div className="flex flex-wrap gap-2 items-center pl-1">
                  <Ruler className="w-4 h-4 text-orange-500" />
                  <input type="number" min="0" step="0.1" placeholder="Length" value={item.length}
                    onChange={e => updateItem(idx, 'length', e.target.value)}
                    className="w-20 px-2 py-1.5 border border-slate-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  <span className="text-slate-400">×</span>
                  <input type="number" min="0" step="0.1" placeholder="Breadth" value={item.breadth}
                    onChange={e => updateItem(idx, 'breadth', e.target.value)}
                    className="w-20 px-2 py-1.5 border border-slate-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  <select value={item.unit} onChange={e => updateItem(idx, 'unit', e.target.value)}
                    className="w-20 px-2 py-1.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="inches">Inches</option>
                    <option value="feet">Feet</option>
                  </select>
                  <span className="text-xs text-slate-400">Sell: रु{Number(item.sold_price).toLocaleString()}</span>
                  <span className="text-xs text-slate-400">| Cost: रु{Number(item.cost_price).toLocaleString()}</span>
                </div>
              )}
            </div>
          ))}

          <div className="text-right text-lg font-bold text-slate-800 pt-2 border-t border-slate-200">
            Total: रु{total.toLocaleString()}
          </div>
        </div>

        <button type="submit" className="w-full py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 font-medium">Save Changes</button>
      </form>

      {showQuickProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowQuickProduct(false)}>
          <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-800 mb-4">{quickEditId ? 'Edit Product Pricing' : 'Quick Add Product'}</h2>
            <div className="space-y-3">
              <div><label className="block text-sm font-medium text-slate-600 mb-1">Product Name *</label>
                <input value={quickForm.name} onChange={e => setQuickForm({ ...quickForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div><label className="block text-sm font-medium text-slate-600 mb-1">Cost Price</label><input type="number" min="0" value={quickForm.cost_price}
                  onChange={e => setQuickForm({ ...quickForm, cost_price: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
                <div><label className="block text-sm font-medium text-slate-600 mb-1">Selling Price</label><input type="number" min="0" value={quickForm.selling_price}
                  onChange={e => setQuickForm({ ...quickForm, selling_price: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input type="checkbox" checked={quickForm.is_dimension}
                  onChange={e => setQuickForm({ ...quickForm, is_dimension: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
                <Ruler className="w-4 h-4 text-orange-500" /> Multi-Dimensional (SqFt)
              </label>
              {quickForm.is_dimension && (
                <div className="grid grid-cols-2 gap-2 pl-6 border-l-2 border-orange-300">
                  <div><label className="block text-xs font-medium text-slate-500 mb-1">SqFt Cost Price</label>
                    <input type="number" min="0" value={quickForm.sqft_cost_price}
                      onChange={e => setQuickForm({ ...quickForm, sqft_cost_price: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
                  <div><label className="block text-xs font-medium text-slate-500 mb-1">SqFt Sell Price</label>
                    <input type="number" min="0" value={quickForm.sqft_selling_price}
                      onChange={e => setQuickForm({ ...quickForm, sqft_selling_price: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
                </div>
              )}
              <p className="text-xs text-slate-400">SKU will be auto-generated</p>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleQuickAddProduct} className="flex-1 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 font-medium text-sm">{quickEditId ? 'Update Product' : 'Add Product'}</button>
              <button onClick={() => { setShowQuickProduct(false); setQuickEditId(null) }} className="px-4 py-2.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Confirm Changes</h2>
              <button onClick={() => setShowConfirm(false)} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-slate-600 mb-4 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">Please confirm the updated order details with the customer before proceeding.</p>
            <div className="space-y-2 text-sm mb-4">
              <div><span className="text-slate-500">Customer:</span> <span className="font-medium">{customerName}</span></div>
              <div><span className="text-slate-500">Phone:</span> <span className="font-medium">{customerPhone}</span></div>
              <div><span className="text-slate-500">Address:</span> <span className="font-medium">{customerAddress}</span></div>
              {orderSource && <div><span className="text-slate-500">Source:</span> <span className="font-medium">{orderSource}{platformHandle ? ` (${platformHandle})` : ''}</span></div>}
              {paymentMethod && <div><span className="text-slate-500">Payment:</span> <span className="font-medium">{paymentMethod}
                {paymentMethod === 'Hybrid' && ` (Online: रु${Number(onlineAmount || 0).toLocaleString()} | Cash: रु${Number(cashAmount || 0).toLocaleString()})`}
              </span></div>}
              {Number(advancePayment) > 0 && <div><span className="text-slate-500">Advance Paid:</span> <span className="font-medium text-green-600">रु{Number(advancePayment).toLocaleString()}</span></div>}
              {deadline && <div><span className="text-slate-500">Deadline:</span> <span className="font-medium">{new Date(deadline).toLocaleDateString()}</span></div>}
              {notes && <div><span className="text-slate-500">Notes:</span> <span className="font-medium">{notes}</span></div>}
            </div>
            <div className="flex gap-3">
              <button onClick={handleConfirm} className="flex-1 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 font-medium text-sm">Confirm & Save</button>
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}