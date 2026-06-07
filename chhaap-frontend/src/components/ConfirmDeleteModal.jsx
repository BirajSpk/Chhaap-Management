import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemName }) {
  const [typed, setTyped] = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    if (typed !== 'DELETE') return
    setTyped('')
    onConfirm()
  }

  const handleClose = () => {
    setTyped('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={handleClose}>
      <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-slate-800">Confirm Delete</h2>
          </div>
          <button onClick={handleClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 mb-1">
          You are about to delete:
        </p>
        <p className="text-sm font-semibold text-slate-800 mb-4">{itemName}</p>
        <p className="text-sm text-slate-600 mb-3">
          Type <span className="font-bold text-red-600">DELETE</span> to confirm:
        </p>
        <input
          value={typed}
          onChange={e => setTyped(e.target.value)}
          placeholder="Type DELETE here..."
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
        />

        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            disabled={typed !== 'DELETE'}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-40 font-medium text-sm"
          >
            Delete
          </button>
          <button onClick={handleClose} className="px-4 py-2.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
