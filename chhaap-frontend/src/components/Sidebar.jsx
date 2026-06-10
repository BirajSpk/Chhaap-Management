import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, CreditCard, LogOut, X, Users, Columns3, Calculator, Shield, Activity } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ordersApi } from '../services/api'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/inventory', label: 'Inventory', icon: Package },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/expenses', label: 'Expenses', icon: CreditCard },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/kanban', label: 'Kanban', icon: Columns3 },
  { to: '/calculator', label: 'Calculator', icon: Calculator },
  { to: '/activity', label: 'Activity Log', icon: Activity },
  { to: '/users', label: 'Users', icon: Shield, adminOnly: true },
]

export default function Sidebar({ isOpen, onClose }) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [orderCount, setOrderCount] = useState(null)

  useEffect(() => {
    const fetchCount = () => {
      ordersApi.getCount().then((res) => setOrderCount(res.count)).catch(() => {})
    }
    fetchCount()
    window.addEventListener('orders-changed', fetchCount)
    return () => window.removeEventListener('orders-changed', fetchCount)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <div className="p-5 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/Chhaap-Logo.png" alt="Chhaap Logo" className="w-10 h-10 rounded-lg object-cover" />
          <div>
            <h1 className="text-lg font-bold leading-tight">Chhaap</h1>
            <p className="text-xs text-slate-400">Management</p>
          </div>
        </div>
        <button onClick={onClose} className="md:hidden p-1 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {user && (
        <div className="px-5 py-3 border-b border-slate-700 text-xs text-slate-400">
          Logged in as <span className="text-slate-300 font-medium">{user.name}</span>
        </div>
      )}

      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ to, label, icon: Icon, adminOnly }) => {
          if (adminOnly && user?.role !== 'admin') return null
          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
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
                <span className="px-2 py-0.5 text-xs font-bold bg-cyan-500/20 text-cyan-300 rounded-full">{orderCount}</span>
              )}
            </NavLink>
          )
        })}
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
    </div>
  )

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      )}

      {/* Mobile sidebar */}
      <div className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0">
        {sidebarContent}
      </aside>
    </>
  )
}
