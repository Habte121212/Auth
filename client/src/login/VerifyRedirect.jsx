import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ClipLoader from 'react-spinners/ClipLoader'
import axios from 'axios'
import './verify-redirect.scss'

const VerifyRedirect = () => {
  const navigate = useNavigate()
  const [showSpinner, setShowSpinner] = useState(true)

  useEffect(() => {
    // Always log out user before redirecting to login
    axios
      .post(
        `${
          import.meta.env.VITE_API_URL || 'http://localhost:8600'
        }/server/auth/logout`,
        {},
        { withCredentials: true },
      )
      .finally(() => {
        const timer = setTimeout(() => {
          setShowSpinner(false)
          navigate('/login?verified=1')
        }, 3000)
        return () => clearTimeout(timer)
      })
  }, [navigate])

  return (
    <div className="verify-redirect-container">
      {showSpinner ? (
        <div className="spinner-content">
          <ClipLoader color="#43a047" size={60} />
          <div className="verify-message">Verifying your email...</div>
        </div>
      ) : null}
    </div>
  )
}

export default VerifyRedirect
