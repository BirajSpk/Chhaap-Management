import { useEffect, useState, useCallback, useMemo } from 'react'
import { Plus, Trash2, Calculator as CalcIcon, FileText, Printer, Pencil, ChevronDown, ChevronRight, Eye, EyeOff, X, Ruler } from 'lucide-react'
import toast from 'react-hot-toast'
import { productsApi, quotationsApi } from '../services/api'
import jsPDF from 'jspdf'
import { autoTable } from 'jspdf-autotable'

export default function Calculator() {
  const [products, setProducts] = useState([])
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerCompany, setCustomerCompany] = useState('')
  const [customerPosition, setCustomerPosition] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [description, setDescription] = useState('')
  const [items, setItems] = useState([{ product_id: '', quantity: 1, sold_price: '', cost_price: '', is_dimension: false, length: null, breadth: null, unit: null }])
  const [productSearch, setProductSearch] = useState({})
  const [saving, setSaving] = useState(false)
  const [generatingPdf, setGeneratingPdf] = useState(false)
  const [quotations, setQuotations] = useState([])
  const [showQuotations, setShowQuotations] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [editing, setEditing] = useState(false)
  const [showQuickProduct, setShowQuickProduct] = useState(false)
  const [quickEditId, setQuickEditId] = useState(null)
  const [quickForm, setQuickForm] = useState({ name: '', cost_price: '', selling_price: '', is_dimension: false, sqft_cost_price: '', sqft_selling_price: '' })
  const [showCost, setShowCost] = useState({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('')

  useEffect(() => {
    productsApi.list().then(setProducts).catch(() => {})
    loadQuotations()
  }, [])

  const loadQuotations = () => {
    quotationsApi.list().then(setQuotations).catch(() => {})
  }

  const selectedProduct = (id) => products.find(p => p.id === Number(id))

  const filteredProducts = useCallback((searchTerm) =>
    products.filter(p =>
      p.name.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
      (p.sku || '').toLowerCase().includes((searchTerm || '').toLowerCase())
    ),
  [products])

  const toggleCost = (idx) => setShowCost(prev => ({ ...prev, [idx]: !prev[idx] }))

  const addItem = () =>
    setItems([...items, { product_id: '', quantity: 1, sold_price: '', cost_price: '', is_dimension: false, length: null, breadth: null, unit: null }])

  const addCustomItem = () =>
    setItems([...items, { is_custom: true, custom_item_name: '', quantity: 1, sold_price: '', cost_price: '' }])

  const addDimensionItem = () =>
    setItems([...items, { product_id: '', quantity: 1, sold_price: 0, cost_price: 0, is_dimension: true, length: '', breadth: '', unit: 'inches' }])

  const removeItem = (idx) => {
    if (items.length === 1) return
    setItems(items.filter((_, i) => i !== idx))
  }

  const total = useMemo(() => items.reduce((sum, item) => sum + (Number(item.sold_price) || 0) * (Number(item.quantity) || 0), 0), [items])

  const handleProductSelect = (idx, product) => {
    const newItems = [...items]
    const isDim = product.is_dimension_product == 1
    newItems[idx] = {
      product_id: product.id,
      quantity: 1,
      sold_price: product.selling_price,
      cost_price: product.cost_price,
      is_dimension: isDim,
      length: isDim ? '' : null,
      breadth: isDim ? '' : null,
      unit: isDim ? 'inches' : null,
    }
    setItems(newItems)
    setProductSearch({ ...productSearch, [idx]: '' })
  }

  const handleProductSelectDim = (idx, product) => {
    if (!product.is_dimension_product) return
    const newItems = [...items]
    newItems[idx] = {
      product_id: product.id,
      quantity: 1,
      sold_price: 0,
      cost_price: 0,
      is_dimension: true,
      length: '',
      breadth: '',
      unit: 'inches',
    }
    setItems(newItems)
    setProductSearch({ ...productSearch, [idx]: '' })
  }

  const updateDimensionCalc = (idx, item) => {
    if (!item.product_id || !item.length || !item.breadth) return
    const p = products.find(x => x.id === Number(item.product_id))
    if (!p?.is_dimension_product) return
    const l = Number(item.length)
    const b = Number(item.breadth)
    const div = item.unit === 'inches' ? 144 : 1
    const sqft = (l * b) / div
    const newItems = [...items]
    newItems[idx].sold_price = (sqft * Number(p.sqft_selling_price || 0)).toFixed(2)
    newItems[idx].cost_price = (sqft * Number(p.sqft_cost_price || 0)).toFixed(2)
    setItems(newItems)
  }

  const updateItem = (idx, field, value) => {
    const newItems = [...items]
    newItems[idx][field] = value
    setItems(newItems)
    if (['length', 'breadth', 'unit', 'product_id'].includes(field) && newItems[idx].is_dimension) {
      setTimeout(() => updateDimensionCalc(idx, newItems[idx]), 0)
    }
  }

  const handleQuickAddProduct = async () => {
    if (!quickForm.name) { toast.error('Product name required'); return }
    try {
      const payload = {
        name: quickForm.name,
        cost_price: Number(quickForm.cost_price || 0),
        selling_price: Number(quickForm.selling_price || 0),
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
      setShowQuickProduct(false)
      setQuickEditId(null)
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
        toast.error(err.response?.data?.error || 'Failed to create product')
      }
    }
  }

  const handleGenerate = async () => {
    if (!customerName) { toast.error('Customer name required'); return }
    if (!items.some(i => i.product_id || i.custom_item_name)) { toast.error('Add at least one item'); return }

    setSaving(true)
    const quoteItems = items
      .filter(i => i.product_id || i.custom_item_name)
      .map(i => {
        let product_name
        if (i.is_custom) {
          product_name = i.custom_item_name
        } else if (i.is_dimension && i.length && i.breadth) {
          const p = selectedProduct(i.product_id)
          product_name = `${p?.name || 'Item'} (${i.length}x${i.breadth} ${i.unit})`
        } else {
          product_name = selectedProduct(i.product_id)?.name || 'Item'
        }
        return { product_name, quantity: Number(i.quantity), sold_price: Number(i.sold_price || 0) }
      })

    try {
      const quote = await quotationsApi.create({
        customer_name: customerName,
        customer_phone: customerPhone || undefined,
        customer_company: customerCompany || undefined,
        customer_position: customerPosition || undefined,
        customer_address: customerAddress || undefined,
        description: description || undefined,
        items: quoteItems,
      })
      toast.success(`Quotation ${quote.quote_number} created`)
      loadQuotations()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save quotation')
    } finally {
      setSaving(false)
    }
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

  const generatePdfBlob = async (quote) => {
    const doc = new jsPDF()
    const pw = doc.internal.pageSize.getWidth()

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

    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('QUOTATION', pw - 14, 22, { align: 'right' })

    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100)
    doc.text(`Quote #: ${quote.quote_number}`, pw - 14, 36, { align: 'right' })
    doc.text(`Date: ${new Date(quote.created_at || Date.now()).toLocaleDateString('en-IN')}`, pw - 14, 42, { align: 'right' })
    doc.text(`Valid Until: ${new Date(quote.valid_until).toLocaleDateString('en-IN')}`, pw - 14, 48, { align: 'right' })

    doc.setDrawColor(148, 34, 34)
    doc.setLineWidth(0.5)
    doc.line(14, 54, pw - 14, 54)

    doc.setTextColor(0)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    let by = 64
    doc.text(quote.customer_name, 14, by); by += 6
    doc.setFont('helvetica', 'normal')
    if (quote.customer_company) { doc.text(quote.customer_company, 14, by); by += 6 }
    if (quote.customer_position) { doc.text(quote.customer_position, 14, by); by += 6 }
    if (quote.customer_phone) { doc.text(quote.customer_phone, 14, by); by += 6 }
    if (quote.customer_address) { doc.text(quote.customer_address, 14, by); by += 6 }
    if (quote.description) {
      const descY = Math.max(by + 4, 94)
      doc.setDrawColor(200)
      doc.setLineWidth(0.3)
      doc.line(14, descY - 4, pw - 14, descY - 4)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.text('Description:', 14, descY)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.text(quote.description, 14, descY + 5)
      by = descY + 12
    }
    const dividerY = Math.max(by + 2, 100)
    doc.setDrawColor(200)
    doc.setLineWidth(0.3)
    doc.line(14, dividerY, pw - 14, dividerY)

    const tableData = quote.items.map((item, i) => [
      i + 1, item.product_name, item.quantity,
      `Rs ${Number(item.sold_price).toLocaleString('en-IN')}`,
      `Rs ${(Number(item.sold_price) * item.quantity).toLocaleString('en-IN')}`,
    ])

    autoTable(doc, {
      startY: dividerY + 6,
      head: [['#', 'Description', 'Qty', 'Rate', 'Amount']],
      body: tableData,
      foot: [['', '', '', 'Grand Total', `Rs ${Number(quote.total_amount).toLocaleString('en-IN')}`]],
      theme: 'grid',
      headStyles: { fillColor: [148, 34, 34], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
      styles: { fontSize: 8, cellPadding: 3 },
      footStyles: { fontStyle: 'bold', fontSize: 9 },
      columnStyles: { 0: { cellWidth: 10, halign: 'center' }, 2: { halign: 'center' }, 3: { halign: 'right' }, 4: { halign: 'right' } },
    })

    const fy = doc.lastAutoTable.finalY + 12
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(100)
    doc.text('Thank you for your interest!', pw / 2, fy, { align: 'center' })
    doc.setFontSize(7)
    doc.setTextColor(150)
    doc.text('Chhaap Creatives Pvt. Ltd. | Jorpati, Gokarneshwor-5, Kathmandu | 9744957686 | contact.chhaapcreatives@gmail.com', pw / 2, fy + 5, { align: 'center' })

    return doc.output('blob')
  }

  const handleDownloadQuote = async (quote) => {
    setGeneratingPdf(true)
    try {
      const blob = await generatePdfBlob(quote)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `QUOTATION_${quote.quote_number}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Quotation downloaded')
    } catch { toast.error('Failed to generate PDF') }
    finally { setGeneratingPdf(false) }
  }

  const handlePrintQuote = async (quote) => {
    setGeneratingPdf(true)
    try {
      const blob = await generatePdfBlob(quote)
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
    } catch { toast.error('Failed to generate PDF') }
    finally { setGeneratingPdf(false) }
  }

  const handleDeleteQuote = (id) => {
    setDeleteTarget(id)
    setDeleteConfirmInput('')
    setShowDeleteConfirm(true)
  }

  const confirmDeleteQuote = async () => {
    if (deleteConfirmInput !== 'DELETE') return
    try {
      await quotationsApi.delete(deleteTarget)
      toast.success('Quotation deleted')
      setShowDeleteConfirm(false)
      setDeleteTarget(null)
      setDeleteConfirmInput('')
      loadQuotations()
      if (selectedQuote?.id === deleteTarget) { setShowQuoteModal(false); setSelectedQuote(null) }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete')
    }
  }

  const openQuoteModal = async (quote, startEditing) => {
    try {
      const full = await quotationsApi.get(quote.id)
      setSelectedQuote(full)
      setEditing(!!startEditing)
      setShowQuoteModal(true)
    } catch { toast.error('Failed to load quotation') }
  }

  const handleEditQuote = async (quote) => {
    await openQuoteModal(quote, true)
  }

  const handleSaveQuote = async () => {
    if (!selectedQuote) return
    const quoteItems = selectedQuote.items.map(i => ({
      product_name: i.product_name,
      quantity: Number(i.quantity),
      sold_price: Number(i.sold_price || 0),
    }))
    try {
      const updated = await quotationsApi.update(selectedQuote.id, {
        customer_name: selectedQuote.customer_name,
        customer_phone: selectedQuote.customer_phone || undefined,
        customer_company: selectedQuote.customer_company || undefined,
        po_number: selectedQuote.po_number || undefined,
        items: quoteItems,
      })
      setSelectedQuote(updated)
      setEditing(false)
      loadQuotations()
      toast.success('Quotation updated')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update')
    }
  }

  const updateQuoteField = (field, value) => {
    setSelectedQuote(prev => ({ ...prev, [field]: value }))
  }

  const updateQuoteItem = (idx, field, value) => {
    setSelectedQuote(prev => {
      const newItems = [...prev.items]
      newItems[idx] = { ...newItems[idx], [field]: value }
      return { ...prev, items: newItems }
    })
  }

  const addQuoteItem = () => {
    setSelectedQuote(prev => ({
      ...prev,
      items: [...prev.items, { product_name: '', quantity: 1, sold_price: 0 }],
    }))
  }

  const removeQuoteItem = (idx) => {
    setSelectedQuote(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }))
  }

  const quoteTotal = useMemo(() => selectedQuote?.items?.reduce((sum, item) => sum + (Number(item.sold_price) || 0) * (Number(item.quantity) || 0), 0) || 0, [selectedQuote?.items])

  const cancelEdit = () => {
    if (selectedQuote) openQuoteModal(selectedQuote, false)
  }

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-3xl">
      <div className="flex items-center gap-2">
        <CalcIcon className="w-6 h-6 text-cyan-600" />
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Cost Calculator</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5 space-y-3">
        <h2 className="font-semibold text-slate-700">Customer Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><label className="block text-sm font-medium text-slate-600 mb-1">Name</label>
            <input value={customerName} onChange={e => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
          <div><label className="block text-sm font-medium text-slate-600 mb-1">Phone</label>
            <input type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value.replace(/[^0-9+\-\s]/g, ''))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
          <div><label className="block text-sm font-medium text-slate-600 mb-1">Company (optional)</label>
            <input value={customerCompany} onChange={e => setCustomerCompany(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
          <div><label className="block text-sm font-medium text-slate-600 mb-1">Position (optional)</label>
            <input value={customerPosition} onChange={e => setCustomerPosition(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
          <div className="sm:col-span-2"><label className="block text-sm font-medium text-slate-600 mb-1">Address (optional)</label>
            <input value={customerAddress} onChange={e => setCustomerAddress(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
        </div>
        <div><label className="block text-sm font-medium text-slate-600 mb-1">Project / Item Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Describe the project or items..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none" /></div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-semibold text-slate-700">Items</h2>
          <div className="flex gap-2 text-sm">
            <button onClick={addItem} className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700 font-medium"><Plus className="w-4 h-4" />Product</button>
            <button onClick={addCustomItem} className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium"><Plus className="w-4 h-4" />Custom</button>
            <button onClick={addDimensionItem} className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium"><Plus className="w-4 h-4" />SqFt</button>
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
                            <span className="font-medium">{p.name}</span>
                            <span className="text-slate-400 ml-2">({p.sku})</span>
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

      <button onClick={handleGenerate} disabled={saving}
        className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-40 font-medium text-sm">
        <FileText className="w-4 h-4" /> Generate Quotation
      </button>

      <div className="bg-white rounded-xl border border-slate-200">
        <button onClick={() => setShowQuotations(!showQuotations)}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl">
          <h2 className="font-semibold text-slate-700">Past Quotations</h2>
          {showQuotations ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
        </button>
        {showQuotations && (
          <div className="px-4 pb-4 overflow-x-auto">
            {quotations.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No quotations yet</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-slate-200 text-slate-500 text-xs uppercase">
                    <th className="text-left py-2 pr-2">Quote #</th>
                    <th className="text-left py-2 px-2">Customer</th>
                    <th className="text-left py-2 px-2 hidden sm:table-cell">Company</th>
                    <th className="text-right py-2 px-2">Amount</th>
                    <th className="text-right py-2 px-2 hidden sm:table-cell">Date</th>
                    <th className="text-right py-2 pl-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quotations.map(q => (
                    <tr key={q.id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="py-2 pr-2 font-medium text-slate-700">{q.quote_number}</td>
                      <td className="py-2 px-2 text-slate-600">{q.customer_name}</td>
                      <td className="py-2 px-2 text-slate-500 hidden sm:table-cell">{q.customer_company || '-'}</td>
                      <td className="py-2 px-2 text-right text-slate-700">रु{Number(q.total_amount).toLocaleString()}</td>
                      <td className="py-2 px-2 text-right text-slate-500 hidden sm:table-cell">{new Date(q.created_at).toLocaleDateString('en-IN')}</td>
                      <td className="py-2 pl-2 text-right whitespace-nowrap">
                        <button onClick={() => openQuoteModal(q, false)} className="text-cyan-600 hover:text-cyan-700 p-1" title="View"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleEditQuote(q)} className="text-indigo-600 hover:text-indigo-700 p-1" title="Edit"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteQuote(q.id)} className="text-red-600 hover:text-red-700 p-1" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {showQuoteModal && selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-800">{editing ? 'Edit ' : ''}{selectedQuote.quote_number}</h2>
              <button onClick={() => { setShowQuoteModal(false); setSelectedQuote(null); setEditing(false) }} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-4">
              {editing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div><label className="block text-xs font-medium text-slate-500 mb-0.5">Customer Name</label>
                    <input value={selectedQuote.customer_name} onChange={e => updateQuoteField('customer_name', e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm" /></div>
                  <div><label className="block text-xs font-medium text-slate-500 mb-0.5">Phone</label>
                    <input value={selectedQuote.customer_phone || ''} onChange={e => updateQuoteField('customer_phone', e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm" /></div>
                  <div><label className="block text-xs font-medium text-slate-500 mb-0.5">Company</label>
                    <input value={selectedQuote.customer_company || ''} onChange={e => updateQuoteField('customer_company', e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm" /></div>
                  <div><label className="block text-xs font-medium text-slate-500 mb-0.5">Position</label>
                    <input value={selectedQuote.customer_position || ''} onChange={e => updateQuoteField('customer_position', e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm" /></div>
                  <div className="sm:col-span-2"><label className="block text-xs font-medium text-slate-500 mb-0.5">Address</label>
                    <input value={selectedQuote.customer_address || ''} onChange={e => updateQuoteField('customer_address', e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm" /></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div><span className="font-medium text-slate-600">Customer:</span> {selectedQuote.customer_name}</div>
                  {selectedQuote.customer_company && <div><span className="font-medium text-slate-600">Company:</span> {selectedQuote.customer_company}</div>}
                  {selectedQuote.customer_position && <div><span className="font-medium text-slate-600">Position:</span> {selectedQuote.customer_position}</div>}
                  {selectedQuote.customer_phone && <div><span className="font-medium text-slate-600">Phone:</span> {selectedQuote.customer_phone}</div>}
                  {selectedQuote.customer_address && <div className="sm:col-span-2"><span className="font-medium text-slate-600">Address:</span> {selectedQuote.customer_address}</div>}
                  <div><span className="font-medium text-slate-600">Date:</span> {new Date(selectedQuote.created_at).toLocaleDateString('en-IN')}</div>
                  <div><span className="font-medium text-slate-600">Valid Until:</span> {new Date(selectedQuote.valid_until).toLocaleDateString('en-IN')}</div>
                </div>
              )}
              {selectedQuote.description && !editing && (
                <div className="text-sm p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-600">Description:</span>
                  <p className="text-slate-700 mt-1">{selectedQuote.description}</p>
                </div>
              )}
              {editing && (
                <div><label className="block text-xs font-medium text-slate-500 mb-0.5">Description</label>
                  <textarea value={selectedQuote.description || ''} onChange={e => updateQuoteField('description', e.target.value)} rows={2}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm resize-none" /></div>
              )}

              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-xs uppercase">
                    <th className="text-left p-2">#</th>
                    <th className="text-left p-2">Description</th>
                    <th className="text-center p-2">Qty</th>
                    <th className="text-right p-2">Rate</th>
                    <th className="text-right p-2">Amount</th>
                    {editing && <th className="text-center p-2"></th>}
                  </tr>
                </thead>
                <tbody>
                  {selectedQuote.items.map((item, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="p-2 text-slate-500">{i + 1}</td>
                      {editing ? (
                        <>
                          <td className="p-2"><input value={item.product_name} onChange={e => updateQuoteItem(i, 'product_name', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-300 rounded text-sm" /></td>
                          <td className="p-2"><input type="number" min="1" value={item.quantity} onChange={e => updateQuoteItem(i, 'quantity', Number(e.target.value))}
                            className="w-16 px-2 py-1 border border-slate-300 rounded text-sm text-center" /></td>
                          <td className="p-2"><input type="number" min="0" step="0.01" value={item.sold_price} onChange={e => updateQuoteItem(i, 'sold_price', Number(e.target.value))}
                            className="w-24 px-2 py-1 border border-slate-300 rounded text-sm text-right" /></td>
                          <td className="p-2 text-right text-slate-700">रु{(Number(item.sold_price) * item.quantity).toLocaleString()}</td>
                          <td className="p-2 text-center">
                            <button onClick={() => removeQuoteItem(i)} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-2 text-slate-700">{item.product_name}</td>
                          <td className="p-2 text-center text-slate-700">{item.quantity}</td>
                          <td className="p-2 text-right text-slate-700">रु{Number(item.sold_price).toLocaleString()}</td>
                          <td className="p-2 text-right text-slate-700">रु{(Number(item.sold_price) * item.quantity).toLocaleString()}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-300 font-bold text-slate-800">
                    <td colSpan={editing ? 4 : 4} className="p-2 text-right">Grand Total</td>
                    <td className="p-2 text-right">रु{quoteTotal.toLocaleString()}</td>
                    {editing && <td></td>}
                  </tr>
                </tfoot>
              </table>
              </div>
              {editing && (
                <button onClick={addQuoteItem} className="text-sm text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              )}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                {editing ? (
                  <>
                    <button onClick={handleSaveQuote}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 font-medium">
                      <FileText className="w-4 h-4" /> Save Changes
                    </button>
                    <button onClick={cancelEdit}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleDownloadQuote(selectedQuote)} disabled={generatingPdf}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-emerald-600 border border-emerald-300 rounded-lg hover:bg-emerald-50 font-medium">
                      <FileText className="w-4 h-4" /> {generatingPdf ? '...' : 'Download'}
                    </button>
                    <button onClick={() => handlePrintQuote(selectedQuote)} disabled={generatingPdf}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 font-medium">
                      <Printer className="w-4 h-4" /> {generatingPdf ? '...' : 'Print'}
                    </button>
                    <button onClick={() => { cancelEdit(); setTimeout(() => handleEditQuote(selectedQuote), 100) }}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50 font-medium">
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                    <button onClick={() => handleDeleteQuote(selectedQuote.id)}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 font-medium ml-auto">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showQuickProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowQuickProduct(false)}>
          <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-800 mb-4">{quickEditId ? 'Edit Product Pricing' : 'Quick Add Product'}</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Product Name *</label>
                <input value={quickForm.name} onChange={e => setQuickForm({ ...quickForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Cost Price</label>
                  <input type="number" min="0" value={quickForm.cost_price} onChange={e => setQuickForm({ ...quickForm, cost_price: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Selling Price</label>
                  <input type="number" min="0" value={quickForm.selling_price} onChange={e => setQuickForm({ ...quickForm, selling_price: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input type="checkbox" checked={quickForm.is_dimension}
                  onChange={e => setQuickForm({ ...quickForm, is_dimension: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
                <Ruler className="w-4 h-4 text-orange-500" /> Multi-Dimensional (SqFt)
              </label>
              {quickForm.is_dimension && (
                <div className="grid grid-cols-2 gap-2 pl-6 border-l-2 border-orange-300">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">SqFt Cost Price</label>
                    <input type="number" min="0" value={quickForm.sqft_cost_price} onChange={e => setQuickForm({ ...quickForm, sqft_cost_price: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">SqFt Sell Price</label>
                    <input type="number" min="0" value={quickForm.sqft_selling_price} onChange={e => setQuickForm({ ...quickForm, sqft_selling_price: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                </div>
              )}
              <p className="text-xs text-slate-400">SKU will be auto-generated</p>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleQuickAddProduct}
                className="flex-1 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 font-medium text-sm">{quickEditId ? 'Update Product' : 'Add Product'}</button>
              <button onClick={() => { setShowQuickProduct(false); setQuickEditId(null) }}
                className="px-4 py-2.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Delete Quotation</h2>
            <p className="text-sm text-slate-600 mb-4">
              This action is irreversible. Type <span className="font-bold text-red-600">DELETE</span> to confirm.
            </p>
            <input value={deleteConfirmInput} onChange={e => setDeleteConfirmInput(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 mb-4" />
            <div className="flex gap-3">
              <button onClick={confirmDeleteQuote} disabled={deleteConfirmInput !== 'DELETE'}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm disabled:opacity-50">Delete</button>
              <button onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
