import React, { useState } from 'react'
import './login.scss'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContex'
import ForgotPasswordModal from '../restpassword/ForgotPasswordModal'
import WarningMessage from './WarningMessage'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8600'

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [socialLoading, setSocialLoading] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [remember, setRemember] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendLimit, setResendLimit] = useState(false)
  const [resendCount, setResendCount] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()
  const { setUser, user } = useAuth()
  const query = new URLSearchParams(location.search)
  const verified = query.get('verified') === '1'

  // Auto-redirect if already logged in
  React.useEffect(() => {
    // Prevent auto-redirect to home if on /login or /login?verified=1
    const path = window.location.pathname + window.location.search
    if (user && !path.startsWith('/login')) {
      navigate('/')
    }
  }, [user, navigate])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    // Client-side validation
    if (!form.email.includes('@')) {
      toast.error('Please enter a valid email address.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      // Fetch CSRF token
      const { data: csrfData } = await axios.get(`${BASE_URL}/csrf-token`, {
        withCredentials: true,
      })
      // Send login request
      const res = await axios.post(
        `${BASE_URL}/server/auth/login`,
        {
          email: form.email,
          password: form.password,
        },
        {
          withCredentials: true,
          headers: {
            'X-CSRF-Token': csrfData.csrfToken,
          },
        },
      )
      setSuccess(true)
      setError('') // Clear any previous error
      toast.success('Login successful!')
      // remember me: store or remove email
      if (remember) {
        localStorage.setItem('rememberedEmail', form.email)
      } else {
        localStorage.removeItem('rememberedEmail')
      }
      // Set user in context and redirect to home
      setUser(res.data.user)
      navigate('/')
    } catch (err) {
      // Check for unverified email error from backend
      const errorMsg =
        err.response?.data?.error || 'Login failed. Please try again.'
      setError(errorMsg)
      setSuccess(false) // Clear any previous success
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    setSocialLoading('google')
    window.location.href = `${BASE_URL}/server/auth/google`
  }

  // Resend verification email
  const handleResendVerification = async () => {
    // Check local resend count before sending request
    const resendData = JSON.parse(
      localStorage.getItem('resendVerification') || '{}',
    )
    let count = resendData.count || 0
    let timestamp = resendData.timestamp || Date.now()
    if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
      // Reset after 24 hours
      count = 0
      timestamp = Date.now()
      localStorage.setItem(
        'resendVerification',
        JSON.stringify({ count, timestamp }),
      )
      setResendCount(0)
      setResendLimit(false)
    }
    if (count >= 3) {
      setResendLimit(true)
      toast.error('You have reached the resend limit (3 per 24 hours).')
      return
    }
    try {
      if (!form.email) {
        toast.error('Please enter your email to resend verification.')
        return
      }
      setResendLoading(true)
      setResendSuccess(false)
      setResendLimit(false)
      // Fetch CSRF token
      const { data: csrfData } = await axios.get(`${BASE_URL}/csrf-token`, {
        withCredentials: true,
      })
      // Send resend verification request with CSRF token
      const res = await axios.post(
        `${BASE_URL}/server/auth/resend-verification`,
        { email: form.email },
        {
          headers: { 'X-CSRF-Token': csrfData.csrfToken },
          withCredentials: true,
        },
      )
      toast.success(
        res.data.message ||
          'Verification email resent. Please check your inbox.',
      )
      setResendSuccess(true)
      // Update resend count in localStorage
      const newCount = count + 1
      setResendCount(newCount)
      localStorage.setItem(
        'resendVerification',
        JSON.stringify({ count: newCount, timestamp }),
      )
      if (newCount >= 3) setResendLimit(true)
    } catch (err) {
      let errorMsg =
        err.response?.data?.error || 'Failed to resend verification email.'
      if (
        err.response?.status === 429 ||
        errorMsg
          .toLowerCase()
          .includes('only request verification email 3 times') ||
        errorMsg.toLowerCase().includes('resend limit')
      ) {
        setResendLimit(true)
      } else if (err.response?.status === 500) {
        errorMsg = 'Something went wrong on the server. Please try again later.'
      }
      toast.error(errorMsg)
    } finally {
      setResendLoading(false)
    }
  }

  // On mount, prefill email if remembered and check resend count
  React.useEffect(() => {
    const remembered = localStorage.getItem('rememberedEmail')
    if (remembered) {
      setForm((f) => ({ ...f, email: remembered }))
      setRemember(true)
    }
    // Check resend count
    const resendData = JSON.parse(
      localStorage.getItem('resendVerification') || '{}',
    )
    if (resendData && resendData.count && resendData.timestamp) {
      // If 24 hours passed, reset
      if (Date.now() - resendData.timestamp > 24 * 60 * 60 * 1000) {
        localStorage.removeItem('resendVerification')
        setResendCount(0)
      } else {
        setResendCount(resendData.count)
        if (resendData.count >= 3) setResendLimit(true)
      }
    }
  }, [])

  // Optionally, reset socialLoading if needed on unmount or navigation
  React.useEffect(() => {
    return () => setSocialLoading(false)
  }, [])

  return (
    <div className="login">
      <div className="loginContainer">
        <h2>Sign In</h2>
        {verified && (
          <div className="success" style={{ marginBottom: '1rem' }}>
            Your email has been verified successfully! Please log in.
          </div>
        )}
        <form className="form" onSubmit={handleSubmit}>
          <label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              required
              aria-label="Email"
              value={form.email}
              onChange={handleChange}
            />
          </label>
          <label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required
              aria-label="Password"
              value={form.password}
              onChange={handleChange}
            />
            <div className="forgetPassword" onClick={() => setShowForgot(true)}>
              Forgot Password?
            </div>
          </label>
          <div className="rememberRow">
            <label className="rememberLabel">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="customCheckbox"></span>
              Remember me
            </label>
          </div>
          {error && <div className="error">{error}</div>}
          {error &&
            (error.toLowerCase().includes('verify') ||
              error.toLowerCase().includes('not verified')) && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  marginBottom: '1rem',
                }}
              >
                {resendLimit ? (
                  <WarningMessage
                    image={
                      'https://cdn-icons-png.flaticon.com/512/463/463612.png' // warning icon
                    }
                    alt="Rate limit warning"
                    message="You have reached the resend limit (3 per 24 hours). Please try again after 24 hours from your first request. If you continue to have issues, please contact support."
                  />
                ) : (
                  <>
                    <button
                      type="button"
                      className="resendBtn"
                      style={{
                        marginBottom: resendSuccess ? '0.5rem' : '0',
                        marginTop: '-0.5rem',
                        background: resendSuccess
                          ? 'linear-gradient(90deg, #e0ffe0 0%, #b2f7b2 100%)'
                          : 'linear-gradient(90deg, #6366F1 0%, #4F46E5 100%)',
                        color: resendSuccess ? '#1976d2' : '#fff',
                        border: resendSuccess ? '1.5px solid #1976d2' : 'none',
                        cursor: resendLoading ? 'not-allowed' : 'pointer',
                        opacity: resendLoading ? 0.7 : 1,
                        transition: 'all 0.2s',
                        minWidth: '220px',
                        position: 'relative',
                        fontWeight: 700,
                        fontSize: '17px',
                        borderRadius: '24px',
                        boxShadow: resendSuccess
                          ? '0 2px 8px rgba(39,174,96,0.08)'
                          : '0 4px 16px rgba(79,70,229,0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                      onClick={handleResendVerification}
                      disabled={loading || resendLoading || resendLimit}
                    >
                      {resendLoading ? (
                        <span
                          className="loader"
                          style={{ marginRight: 8 }}
                        ></span>
                      ) : resendSuccess ? (
                        <>
                          <svg
                            width="20"
                            height="20"
                            fill="#27ae60"
                            style={{ marginRight: 6 }}
                            viewBox="0 0 20 20"
                          >
                            <path d="M7.629 15.314a1 1 0 0 1-1.414 0l-3.243-3.243a1 1 0 1 1 1.414-1.414l2.536 2.536 6.536-6.536a1 1 0 0 1 1.414 1.414l-7.243 7.243z" />
                          </svg>
                          Sent!
                        </>
                      ) : (
                        <>
                          <svg
                            width="20"
                            height="20"
                            fill="#fff"
                            style={{ marginRight: 6 }}
                            viewBox="0 0 20 20"
                          >
                            <path d="M2.94 6.94a8 8 0 1 1 11.314 11.314A8 8 0 0 1 2.94 6.94zm1.414 1.414a6 6 0 1 0 8.486 8.486A6 6 0 0 0 4.354 8.354zm2.828 2.828a1 1 0 0 1 1.414 0l2.828 2.828a1 1 0 0 1-1.414 1.414l-2.828-2.828a1 1 0 0 1 0-1.414z" />
                          </svg>
                          Resend verification email
                        </>
                      )}
                    </button>
                    {resendSuccess && (
                      <span
                        style={{
                          color: '#27ae60',
                          fontSize: '0.98rem',
                          marginTop: 4,
                          fontWeight: 500,
                        }}
                      >
                        Please check your inbox (and spam folder).
                      </span>
                    )}
                  </>
                )}
              </div>
            )}
          <button
            type="submit"
            className="loginBtn"
            disabled={loading || success}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          {success && <div className="success">Login successful!</div>}
        </form>
        <div className="socialLogin">
          <button
            type="button"
            className={`socialBtn google${
              socialLoading === 'google' ? ' loading' : ''
            }`}
            disabled={loading || success || socialLoading}
            onClick={handleGoogleLogin}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 48 48"
              style={{ marginRight: '8px' }}
            >
              <g>
                <path
                  fill="#4285F4"
                  d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.36 30.77 0 24 0 14.82 0 6.73 5.1 2.69 12.55l7.98 6.2C12.36 13.13 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#34A853"
                  d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.66 7.04l7.19 5.59C43.98 37.36 46.1 31.45 46.1 24.55z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.67 28.75c-1.01-2.97-1.01-6.18 0-9.15l-7.98-6.2C.99 17.1 0 20.43 0 24c0 3.57.99 6.9 2.69 10.1l7.98-6.2z"
                />
                <path
                  fill="#EA4335"
                  d="M24 48c6.48 0 11.93-2.15 15.9-5.85l-7.19-5.59c-2.01 1.35-4.6 2.15-8.71 2.15-6.26 0-11.64-3.63-13.33-8.7l-7.98 6.2C6.73 42.9 14.82 48 24 48z"
                />
                <path fill="none" d="M0 0h48v48H0z" />
              </g>
            </svg>
            {socialLoading === 'google' ? (
              <span className="loader"></span>
            ) : (
              'Continue with Google'
            )}
          </button>
          <div className="accountPrompt">
            <span>Don't have an account?</span>
            <a className="registerLink" href="/register">
              Sign up
            </a>
          </div>
        </div>
        {showForgot && (
          <ForgotPasswordModal
            show={showForgot}
            onClose={() => setShowForgot(false)}
          />
        )}
      </div>
    </div>
  )
}

export default Login
