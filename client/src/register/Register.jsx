import React, { useState } from 'react'
import './register.scss'

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [socialLoading, setSocialLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      // setSuccess(true)
    }, 1000)
  }

  const handleGoogleLogin = () => {
    setSocialLoading('google')
    // Simulate Google login
    setTimeout(() => {
      setSocialLoading(false)
      // setSuccess(true)
    }, 1000)
  }

  return (
    <div className="register">
      <div className="registerContainer">
        <h2>Create a New Account</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              required
              aria-label="Name"
              value={form.name}
              onChange={handleChange}
            />
          </label>
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
          </label>
          <label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              aria-label="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </label>
          {error && <div className="error">{error}</div>}
          <button
            type="submit"
            className="registerBtn"
            disabled={loading || success}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          {success && <div className="success">Registration successful!</div>}
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
            <span>Already have an account?</span>
            <a className="loginLink" href="/login">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
