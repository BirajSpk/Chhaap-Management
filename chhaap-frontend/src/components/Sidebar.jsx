import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, CreditCard, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ordersApi } from '../services/api'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/inventory', label: 'Inventory', icon: Package },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/expenses', label: 'Expenses', icon: CreditCard },
]

export default function Sidebar() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [orderCount, setOrderCount] = useState(null)

  useEffect(() => {
    ordersApi.getCount().then((res) => setOrderCount(res.count)).catch(() => {})
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
      <div className="p-5 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <img src="/Chhaap Logo.png" alt="Chhaap Logo" className="w-10 h-10 rounded-lg object-cover" />
          <div>
            <h1 className="text-lg font-bold leading-tight">Chhaap</h1>
            <p className="text-xs text-slate-400">Management</p>
          </div>
        </div>
      </div>

      {user && (
        <div className="px-5 py-3 border-b border-slate-700 text-xs text-slate-400">
          Logged in as <span className="text-slate-300 font-medium">{user.name}</span>
        </div>
      )}

      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="flex-1">{label}</span>
            {label === 'Orders' && orderCount !== null && (
              <span className="px-2 py-0.5 text-xs font-bold bg-cyan-500/20 text-cyan-300 rounded-full">
                {orderCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
