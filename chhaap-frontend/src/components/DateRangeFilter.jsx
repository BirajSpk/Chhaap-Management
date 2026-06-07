import { useState } from 'react'
import { Calendar } from 'lucide-react'

const presets = [
  { label: '1 Day', days: 1 },
  { label: '7 Days', days: 7 },
  { label: '1 Month', days: 30 },
  { label: '1 Year', days: 365 },
]

function formatDate(d) {
  return d.toISOString().slice(0, 10)
}

export default function DateRangeFilter({ onChange }) {
  const [activePreset, setActivePreset] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const applyPreset = (days) => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - days)
    setActivePreset(days)
    setStartDate(formatDate(start))
    setEndDate(formatDate(end))
    onChange(formatDate(start), formatDate(end))
  }

  const applyCustom = () => {
    if (!startDate || !endDate) return
    setActivePreset(null)
    onChange(startDate, endDate)
  }

  const clearFilter = () => {
    setActivePreset(null)
    setStartDate('')
    setEndDate('')
    onChange(null, null)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Calendar className="w-4 h-4 text-slate-400" />
      {presets.map(p => (
        <button
          key={p.days}
          onClick={() => applyPreset(p.days)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
            activePreset === p.days
              ? 'bg-cyan-600 text-white border-cyan-600'
              : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
          }`}
        >
          {p.label}
        </button>
      ))}
      <div className="h-5 w-px bg-slate-300 mx-1" />
      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
        className="px-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
      <span className="text-xs text-slate-400">to</span>
      <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
        className="px-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
      <button onClick={applyCustom}
        disabled={!startDate || !endDate}
        className="px-3 py-1.5 text-xs font-medium bg-white text-cyan-600 border border-cyan-300 rounded-lg hover:bg-cyan-50 disabled:opacity-40">
        Apply
      </button>
      {(activePreset || startDate || endDate) && (
        <button onClick={clearFilter} className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700">
          Clear
        </button>
      )}
    </div>
  )
}
