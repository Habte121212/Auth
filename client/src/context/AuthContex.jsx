import React, { useEffect, useState } from 'react'

const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // On mount, check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true)
      setError(null)
      try {
        //  use HTTP-only cookies
        const res = await fetch('http://localhost:8600/server/auth/me', {
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (err) {
        setError('Failed to check authentication')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  // Login function (should call backend API)
  const login = async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('http://localhost:8600/server/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials),
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        setError(null)
        return true
      } else {
        const data = await res.json()
        setError(data.message || 'Login failed')
        setUser(null)
        return false
      }
    } catch (err) {
      setError('Network error')
      setUser(null)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Logout function (should call backend API)
  const logout = async () => {
    setLoading(true)
    setError(null)
    try {
      await fetch('http://localhost:8600/server/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch {}
    setUser(null)
    setLoading(false)
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, error, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => React.useContext(AuthContext)
