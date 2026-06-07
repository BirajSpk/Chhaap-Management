import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Package, Search, Eye, EyeOff } from 'lucide-react'
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

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Inventory</h1>
        <button
          onClick={() => { setEditing(null); setShowModal(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          placeholder="Search by name or SKU..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">SKU</th>
              <th className="text-right px-4 py-3 font-medium text-slate-600">Cost Price</th>
              <th className="text-right px-4 py-3 font-medium text-slate-600">Selling Price</th>
              <th className="text-center px-4 py-3 font-medium text-slate-600 w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-slate-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-slate-400">
                <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                {search ? 'No products match your search' : 'No products yet'}
              </td></tr>
            ) : filtered.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                <td className="px-4 py-3 text-slate-500 font-mono text-xs">{p.sku}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-slate-600">
                      {showCost[p.id] ? `₹${Number(p.cost_price).toLocaleString()}` : '₹***'}
                    </span>
                    <button onClick={() => toggleCost(p.id)} className="p-0.5 text-slate-400 hover:text-slate-600">
                      {showCost[p.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-slate-600">₹{Number(p.selling_price).toLocaleString()}</td>
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

      {showModal && (
        <ProductModal
          product={editing}
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); fetch() }}
        />
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
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name) return toast.error('Product name required')
    try {
      if (product) {
        await productsApi.update(product.id, form)
        toast.success('Product updated')
      } else {
        await productsApi.create(form)
        toast.success('Product created')
      }
      onSaved()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-slate-800 mb-4">{product ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input label="Product Name" value={form.name} onChange={v => setForm({...form, name: v})} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Cost Price (₹)" type="number" value={form.cost_price} onChange={v => setForm({...form, cost_price: v})} />
            <Input label="Selling Price (₹)" type="number" value={form.selling_price} onChange={v => setForm({...form, selling_price: v})} />
          </div>
          {!product && (
            <p className="text-xs text-slate-400">SKU will be auto-generated (CHHP-XXXX)</p>
          )}
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 font-medium text-sm">
              {product ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm">
              Cancel
            </button>
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
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      />
    </div>
  )
}
