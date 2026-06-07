import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('chhaap_token')
    if (!token) {
      setLoading(false)
      return
    }
    authApi.verify()
      .then((res) => setUser(res.user))
      .catch(() => localStorage.removeItem('chhaap_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password, rememberMe) => {
    const res = await authApi.login({ email, password, remember_me: rememberMe })
    localStorage.setItem('chhaap_token', res.token)
    setUser(res.user)
    return res
  }

  const logout = () => {
    localStorage.removeItem('chhaap_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
