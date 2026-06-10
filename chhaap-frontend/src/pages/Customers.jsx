import { useEffect, useState, useMemo } from 'react'
import { Search, Phone, MapPin, ShoppingCart, DollarSign, Trash2, Plus, Pencil } from 'lucide-react'
import toast from 'react-hot-toast'
import { customersApi } from '../services/api'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [showNew, setShowNew] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    customersApi.list().then(setCustomers).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => search
    ? customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search))
    : customers,
  [customers, search])

  const handleCreate = async () => {
    if (!form.name || !form.phone) { toast.error('Name and phone required'); return }
    try {
      await customersApi.create(form)
      toast.success('Customer created')
      setShowNew(false)
      setForm({ name: '', phone: '', address: '' })
      const list = await customersApi.list()
      setCustomers(list)
    } catch (err) { toast.error(err.response?.data?.error || 'Failed') }
  }

  const handleUpdate = async () => {
    if (!selected) return
    try {
      await customersApi.update(selected.id, form)
      toast.success('Customer updated')
      setEditing(false)
      const c = await customersApi.get(selected.id)
      setSelected(c)
      const list = await customersApi.list()
      setCustomers(list)
    } catch (err) { toast.error(err.response?.data?.error || 'Failed') }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await customersApi.delete(deleteTarget.id)
      toast.success('Customer deleted')
      setDeleteTarget(null)
      setSelected(null)
      const list = await customersApi.list()
      setCustomers(list)
    } catch (err) { toast.error(err.response?.data?.error || 'Failed') }
  }

  const openEdit = (c) => {
    setForm({ name: c.name, phone: c.phone, address: c.address || '' })
    setEditing(true)
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-xl md:text-2xl font-bold text-slate-800">Customers</h1>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <button onClick={() => { setForm({ name: '', phone: '', address: '' }); setShowNew(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {loading ? <div className="p-4 text-slate-400 text-sm">Loading...</div> :
              filtered.length === 0 ? <div className="p-4 text-slate-400 text-sm">No customers found</div> :
              filtered.map(c => (
                <div key={c.id} onClick={() => { customersApi.get(c.id).then(setSelected); setEditing(false) }}
                  className={`p-3 cursor-pointer hover:bg-slate-50 transition-colors ${selected?.id === c.id ? 'bg-cyan-50 border-l-4 border-l-cyan-500' : ''}`}>
                  <div className="font-medium text-sm text-slate-800">{c.name}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" />{c.phone}</div>
                  <div className="text-xs text-slate-400 mt-1">{c.total_orders} orders · रु{Number(c.lifetime_revenue).toLocaleString()}</div>
                </div>
              ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">{editing ? 'Edit Customer' : selected.name}</h2>
                <div className="flex gap-2">
                  {!editing && <button onClick={() => openEdit(selected)} className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg"><Pencil className="w-4 h-4" /></button>}
                  <button onClick={() => setDeleteTarget(selected)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              {editing ? (
                <div className="space-y-3">
                  <div><label className="block text-sm font-medium text-slate-600 mb-1">Name</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
                  <div><label className="block text-sm font-medium text-slate-600 mb-1">Phone</label>
                    <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value.replace(/[^0-9+\-\s]/g, '') })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
                  <div><label className="block text-sm font-medium text-slate-600 mb-1">Address</label>
                    <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={2}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none" /></div>
                  <div className="flex gap-2">
                    <button onClick={handleUpdate} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm font-medium">Save</button>
                    <button onClick={() => setEditing(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600"><Phone className="w-4 h-4 text-slate-400" />{selected.phone}</div>
                  {selected.address && <div className="flex items-center gap-2 text-sm text-slate-600"><MapPin className="w-4 h-4 text-slate-400" />{selected.address}</div>}
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-sm"><ShoppingCart className="w-4 h-4 text-cyan-500" /><span className="text-slate-500">Orders:</span><span className="font-medium">{selected.total_orders}</span></div>
                    <div className="flex items-center gap-2 text-sm"><DollarSign className="w-4 h-4 text-emerald-500" /><span className="text-slate-500">Revenue:</span><span className="font-medium">रु{Number(selected.lifetime_revenue).toLocaleString()}</span></div>
                  </div>
                  <div className="pt-3 border-t border-slate-200">
                    <h3 className="font-medium text-slate-700 mb-2 text-sm">Order History</h3>
                    {selected.orders?.length > 0 ? (
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {selected.orders.map(o => (
                          <div key={o.id} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg text-xs">
                            <span className="font-medium">#{o.id}</span>
                            <span>रु{Number(o.total_amount).toLocaleString()}</span>
                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${o.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{o.status}</span>
                            <span className="text-slate-400">{new Date(o.created_at).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-sm text-slate-400">No orders yet</p>}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Select a customer to view details</p>
            </div>
          )}
        </div>
      </div>

      {showNew && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowNew(false)}>
          <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-800 mb-4">New Customer</h2>
            <div className="space-y-3">
              <div><label className="block text-sm font-medium text-slate-600 mb-1">Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
              <div><label className="block text-sm font-medium text-slate-600 mb-1">Phone *</label>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value.replace(/[^0-9+\-\s]/g, '') })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
              <div><label className="block text-sm font-medium text-slate-600 mb-1">Address</label>
                <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none" /></div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleCreate} className="flex-1 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 font-medium text-sm">Create</button>
              <button onClick={() => setShowNew(false)} className="px-4 py-2.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        itemName={deleteTarget ? `${deleteTarget.name} (${deleteTarget.phone})` : ''} />
    </div>
  )
}
