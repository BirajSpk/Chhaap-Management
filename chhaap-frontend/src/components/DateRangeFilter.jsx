import { useState } from 'react'
import { Calendar } from 'lucide-react'

const presets = [
  { label: '1D', days: 1 },
  { label: '7D', days: 7 },
  { label: '1M', days: 30 },
  { label: '1Y', days: 365 },
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
    <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
      {presets.map(p => (
        <button
          key={p.days}
          onClick={() => applyPreset(p.days)}
          className={`px-2 md:px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
            activePreset === p.days
              ? 'bg-cyan-600 text-white border-cyan-600'
              : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
          }`}
        >
          {p.label}
        </button>
      ))}
      <div className="hidden sm:block h-5 w-px bg-slate-300 mx-1" />
      <div className="flex items-center gap-1 w-full sm:w-auto">
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
          className="flex-1 sm:w-28 px-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        <span className="text-xs text-slate-400">to</span>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
          className="flex-1 sm:w-28 px-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        <button onClick={applyCustom}
          disabled={!startDate || !endDate}
          className="px-2 md:px-3 py-1.5 text-xs font-medium bg-white text-cyan-600 border border-cyan-300 rounded-lg hover:bg-cyan-50 disabled:opacity-40">
          Apply
        </button>
        {(activePreset || startDate || endDate) && (
          <button onClick={clearFilter} className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700">
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
