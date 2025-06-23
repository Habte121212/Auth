import React, { useState } from 'react'
import './register.scss'
import axios from 'axios'
import { toast } from 'react-toastify'

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [socialLoading, setSocialLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess(false)
    // validation
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }
    if (form.name.length < 3) {
      toast.error('Name must be at least 3 characters long')
      return
    }
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      toast.error('Invalid email address')
      return
    }
    setLoading(true)
    try {
      // Fetch CSRF token
      const { data } = await axios.get('http://localhost:8600/csrf-token', {
        withCredentials: true,
      })
      await axios.post(
        'http://localhost:8600/server/auth/register',
        {
          name: form.name,
          email: form.email,
          password: form.password,
        },
        {
          withCredentials: true,
          headers: {
            'X-CSRF-Token': data.csrfToken,
          },
        },
      )
      setSuccess(true)
      toast.success(
        'Registration successful! Check your email to verify your account.',
      )
    } catch (err) {
      toast.error(
        err.response?.data?.error || 'Registration failed. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    setSocialLoading(true)
    window.location.href = 'http://localhost:8600/server/auth/google'
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
          <button
            type="submit"
            className="registerBtn"
            disabled={loading || success}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          {success && (
            <div className="success">
              Registration successful! Check your email to verify your account.
            </div>
          )}
        </form>
        <div className="socialLogin">
          <button
            type="button"
            className={`socialBtn google${socialLoading ? ' loading' : ''}`}
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
            {socialLoading ? (
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
