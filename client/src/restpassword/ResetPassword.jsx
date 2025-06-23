import React, { useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import './restpassword.scss'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8600'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Get token from query params
  const query = new URLSearchParams(location.search)
  const token = query.get('token')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.')
      toast.warn('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      const { data: csrfData } = await axios.get(`${BASE_URL}/csrf-token`, {
        withCredentials: true,
      })
      await axios.post(
        `${BASE_URL}/server/auth/password/reset`,
        { token, password },
        {
          headers: { 'X-CSRF-Token': csrfData.csrfToken },
          withCredentials: true,
        },
      )
      setSuccess(true)
      toast.success('Password reset successful! You can now log in.')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="restpassword">
        <div className="restpasswordContainer">
          <div className="error">Invalid or missing reset token.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="restpassword">
      <div className="restpasswordContainer">
        <h2>Reset Password</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
            <span
              className="togglePassword"
              onClick={() => setShowPassword((v) => !v)}
              style={{
                position: 'absolute',
                right: 12,
                top: 12,
                cursor: 'pointer',
                color: '#4285f4',
                fontSize: 18,
              }}
              tabIndex={0}
              role="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </label>
          <label style={{ position: 'relative' }}>
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
            <span
              className="togglePassword"
              onClick={() => setShowConfirm((v) => !v)}
              style={{
                position: 'absolute',
                right: 12,
                top: 12,
                cursor: 'pointer',
                color: '#4285f4',
                fontSize: 18,
              }}
              tabIndex={0}
              role="button"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? '🙈' : '👁️'}
            </span>
          </label>
          {error && <div className="error">{error}</div>}
          <button
            type="submit"
            className="restpasswordBtn"
            disabled={loading || success}
          >
            {loading ? (
              <span className="loader" style={{ marginRight: 8 }}></span>
            ) : null}
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          {success && <div className="success">Password reset successful!</div>}
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
