import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './restpassword.scss'
import { toast } from 'react-toastify'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8600'

const ForgotPasswordModal = ({ show, onClose }) => {
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotMsg, setForgotMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendResetLoading, setResendResetLoading] = useState(false)
  const [resendResetSuccess, setResendResetSuccess] = useState(false)
  const [resendResetCooldown, setResendResetCooldown] = useState(0)

  const handleForgotSubmit = async (e) => {
    e.preventDefault()
    setForgotMsg('')
    setError('')
    if (!forgotEmail || !forgotEmail.includes('@')) {
      toast.error('Please enter a valid email address!')
      return
    }
    // Only allow Gmail addresses
    if (!forgotEmail.toLowerCase().endsWith('@gmail.com')) {
      toast.error('Invalid email address!')
      return
    }
    setLoading(true)
    try {
      const { data: csrfData } = await axios.get(`${BASE_URL}/csrf-token`, {
        withCredentials: true,
      })
      await axios.post(
        `${BASE_URL}/server/auth/password/request`,
        { email: forgotEmail },
        {
          headers: { 'X-CSRF-Token': csrfData.csrfToken },
          withCredentials: true,
        },
      )
      setForgotMsg('If this email exists, a reset link has been sent.')
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          'Failed to send reset link. Please try again',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleResendReset = async () => {
    setResendResetLoading(true)
    setResendResetSuccess(false)
    setError('')
    try {
      const { data: csrfData } = await axios.get(`${BASE_URL}/csrf-token`, {
        withCredentials: true,
      })
      await axios.post(
        `${BASE_URL}/server/auth/password/request`,
        { email: forgotEmail },
        {
          headers: { 'X-CSRF-Token': csrfData.csrfToken },
          withCredentials: true,
        },
      )
      setResendResetSuccess(true)
      setForgotMsg('If this email exists, a reset link has been resent.')
      setResendResetCooldown(30)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend reset link.')
    } finally {
      setResendResetLoading(false)
    }
  }

  useEffect(() => {
    if (resendResetCooldown > 0) {
      const timer = setTimeout(
        () => setResendResetCooldown(resendResetCooldown - 1),
        1000,
      )
      return () => clearTimeout(timer)
    }
  }, [resendResetCooldown])

  if (!show) return null

  return (
    <div className="forgotModal">
      <form className="forgotForm" onSubmit={handleForgotSubmit}>
        <h3>Reset Password</h3>
        <input
          type="email"
          placeholder="Enter your email"
          value={forgotEmail}
          onChange={(e) => setForgotEmail(e.target.value)}
          required
          autoFocus
          disabled={loading || resendResetLoading}
        />
        {error && <div className="error">{error}</div>}
        {forgotMsg && <div className="success">{forgotMsg}</div>}
        <button
          type="submit"
          className="restpasswordBtn"
          disabled={loading || forgotMsg}
        >
          {loading ? (
            <span className="loader" style={{ marginRight: 8 }}></span>
          ) : null}
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        <button
          type="button"
          className="restpasswordBtn"
          style={{
            marginTop: 8,
            background: resendResetSuccess ? '#e0ffe0' : '#1976d2',
            color: resendResetSuccess ? '#1976d2' : '#fff',
            border: resendResetSuccess ? '1px solid #1976d2' : 'none',
            opacity: resendResetLoading || resendResetCooldown > 0 ? 0.7 : 1,
            cursor:
              resendResetLoading || resendResetCooldown > 0
                ? 'not-allowed'
                : 'pointer',
            width: '100%',
            fontWeight: 600,
            letterSpacing: 0.2,
          }}
          onClick={handleResendReset}
          disabled={
            resendResetLoading ||
            resendResetCooldown > 0 ||
            !forgotEmail ||
            loading
          }
        >
          {resendResetLoading ? (
            <span className="loader" style={{ marginRight: 8 }}></span>
          ) : null}
          {resendResetCooldown > 0
            ? `Resend Link (${resendResetCooldown}s)`
            : resendResetSuccess
            ? 'Link Resent!'
            : 'Resend Reset Link'}
        </button>
        <button
          type="button"
          className="closeBtn"
          onClick={() => {
            onClose()
            setForgotMsg('')
            setError('')
            setResendResetSuccess(false)
            setResendResetCooldown(0)
          }}
          disabled={loading || resendResetLoading}
        >
          &times;
        </button>
      </form>
    </div>
  )
}

export default ForgotPasswordModal
