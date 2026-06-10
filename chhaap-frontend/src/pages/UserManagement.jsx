import { useEffect, useState } from 'react'
import { Plus, Trash2, Pencil, Shield, ShieldOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { usersApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'

export default function UserManagement() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff' })

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      const data = await usersApi.list()
      setUsers(data)
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  const openCreate = () => {
    setForm({ name: '', email: '', password: '', role: 'staff' })
    setEditing(null)
    setShowForm(true)
  }

  const openEdit = (u) => {
    setForm({ name: u.name, email: u.email, password: '', role: u.role })
    setEditing(u)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.email) { toast.error('Name and email required'); return }
    if (!editing && !form.password) { toast.error('Password required for new users'); return }

    try {
      if (editing) {
        await usersApi.update(editing.id, form)
        toast.success('User updated')
      } else {
        await usersApi.create(form)
        toast.success('User created')
      }
      setShowForm(false)
      setEditing(null)
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await usersApi.delete(deleteTarget.id)
      toast.success('User deleted')
      setDeleteTarget(null)
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed')
    }
  }

  if (user?.role !== 'admin') {
    return <div className="p-6 text-center text-slate-500 mt-20">You need admin access to manage users.</div>
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">User Management</h1>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm font-medium">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden sm:table-cell">Email</th>
                <th className="text-center px-4 py-3 font-medium text-slate-600">Role</th>
                <th className="text-center px-4 py-3 font-medium text-slate-600 hidden md:table-cell">Created</th>
                <th className="text-center px-4 py-3 font-medium text-slate-600 w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-slate-400">Loading...</td></tr>
              ) : users.map(u => (
                <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{u.name}</td>
                  <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">{u.email}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <ShieldOff className="w-3 h-3" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-500 text-xs hidden md:table-cell">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEdit(u)} className="p-1.5 text-cyan-600 hover:bg-cyan-50 rounded" title="Edit"><Pencil className="w-4 h-4" /></button>
                      {u.id !== 1 && <button onClick={() => setDeleteTarget(u)} className="p-1.5 text-red-500 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-4 h-4" /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-800 mb-4">{editing ? 'Edit User' : 'New User'}</h2>
            <div className="space-y-3">
              <div><label className="block text-sm font-medium text-slate-600 mb-1">Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
              <div><label className="block text-sm font-medium text-slate-600 mb-1">Email *</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
              <div><label className="block text-sm font-medium text-slate-600 mb-1">Password {editing ? '(leave blank to keep)' : '*'}</label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" /></div>
              <div><label className="block text-sm font-medium text-slate-600 mb-1">Role</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select></div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleSave} className="flex-1 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 font-medium text-sm">
                {editing ? 'Save Changes' : 'Create User'}
              </button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        itemName={deleteTarget ? `${deleteTarget.name} (${deleteTarget.email})` : ''} />
    </div>
  )
}
