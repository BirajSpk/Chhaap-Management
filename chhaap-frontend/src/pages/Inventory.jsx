import { useEffect, useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, Package, Search, Eye, EyeOff, Ruler } from 'lucide-react'
import toast from 'react-hot-toast'
import { productsApi } from '../services/api'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'

export default function Inventory() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [showCost, setShowCost] = useState({})

  const fetch = async () => {
    try { setProducts(await productsApi.list()) }
    catch { toast.error('Failed to load products') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await productsApi.delete(deleteTarget.id)
      toast.success('Product deleted')
      setDeleteTarget(null)
      fetch()
    } catch { toast.error('Failed to delete') }
  }

  const toggleCost = (id) => {
    setShowCost(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const filtered = useMemo(() => products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  ), [products, search])

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Inventory</h1>
        <button onClick={() => { setEditing(null); setShowModal(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm font-medium">
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Product</span>
        </button>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input placeholder="Search by name or SKU..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[650px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden sm:table-cell">SKU</th>
                <th className="text-center px-4 py-3 font-medium text-slate-600 hidden sm:table-cell">Type</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">Cost Price</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">Selling Price</th>
                <th className="text-center px-4 py-3 font-medium text-slate-600 w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-400">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  {search ? 'No products match your search' : 'No products yet'}
                </td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs hidden sm:table-cell">{p.sku}</td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    {p.is_dimension_product == 1 ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
                        <Ruler className="w-3 h-3" /> SqFt
                      </span>
                    ) : <span className="text-xs text-slate-400">Standard</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-slate-600">{showCost[p.id] ? `रु${Number(p.cost_price).toLocaleString()}` : 'रु***'}</span>
                      <button onClick={() => toggleCost(p.id)} className="p-0.5 text-slate-400 hover:text-slate-600">
                        {showCost[p.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600">
                    रु{Number(p.selling_price).toLocaleString()}
                    {p.is_dimension_product == 1 && <span className="text-xs text-orange-500 ml-1">(+रु{Number(p.sqft_selling_price).toLocaleString()}/sqft)</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => { setEditing(p); setShowModal(true) }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteTarget(p)} className="p-1.5 text-red-600 hover:bg-red-50 rounded ml-1" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ProductModal product={editing} onClose={() => setShowModal(false)} onSaved={() => { setShowModal(false); fetch() }} />
      )}

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget ? `Product: ${deleteTarget.name}` : ''}
      />
    </div>
  )
}

function ProductModal({ product, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    cost_price: product?.cost_price || '',
    selling_price: product?.selling_price || '',
    is_dimension_product: product?.is_dimension_product == 1 || false,
    sqft_cost_price: product?.sqft_cost_price || '',
    sqft_selling_price: product?.sqft_selling_price || '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name) return toast.error('Product name required')
    try {
      const payload = {
        name: form.name,
        cost_price: Number(form.cost_price || 0),
        selling_price: Number(form.selling_price || 0),
        is_dimension_product: form.is_dimension_product ? 1 : 0,
        sqft_cost_price: form.is_dimension_product ? Number(form.sqft_cost_price || 0) : 0,
        sqft_selling_price: form.is_dimension_product ? Number(form.sqft_selling_price || 0) : 0,
      }
      if (product) {
        await productsApi.update(product.id, payload)
        toast.success('Product updated')
      } else {
        await productsApi.create(payload)
        toast.success('Product created')
      }
      onSaved()
    } catch (err) {
      if (err.response?.status === 409 && err.response?.data?.existing) {
        const ex = err.response.data.existing
        setForm({
          name: ex.name,
          cost_price: ex.cost_price,
          selling_price: ex.selling_price,
          is_dimension_product: ex.is_dimension_product == 1,
          sqft_cost_price: ex.sqft_cost_price,
          sqft_selling_price: ex.sqft_selling_price,
        })
        toast.success('Loaded existing product — adjust and save')
      } else {
        toast.error(err.response?.data?.error || 'Failed to save')
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-slate-800 mb-4">{product ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input label="Product Name" value={form.name} onChange={v => setForm({...form, name: v})} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Cost Price (रु)" type="number" value={form.cost_price} onChange={v => setForm({...form, cost_price: v})} />
            <Input label="Selling Price (रु)" type="number" value={form.selling_price} onChange={v => setForm({...form, selling_price: v})} />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input type="checkbox" checked={form.is_dimension_product}
              onChange={e => setForm({...form, is_dimension_product: e.target.checked})}
              className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
            <Ruler className="w-4 h-4 text-orange-500" />
            Multi-Dimensional Product (SqFt pricing)
          </label>
          {form.is_dimension_product && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6 border-l-2 border-orange-300">
              <Input label="SqFt Cost Price (रु)" type="number" value={form.sqft_cost_price}
                onChange={v => setForm({...form, sqft_cost_price: v})} />
              <Input label="SqFt Selling Price (रु)" type="number" value={form.sqft_selling_price}
                onChange={v => setForm({...form, sqft_selling_price: v})} />
            </div>
          )}
          {!product && (
            <p className="text-xs text-slate-400">SKU will be auto-generated (CHHP-XXXX)</p>
          )}
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 font-medium text-sm">
              {product ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Input({ label, type = 'text', value, onChange, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
    </div>
  )
}