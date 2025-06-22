import React from 'react'
import './App.css'

const Home = () => {
  return (
    <div className="home-page">
      <div className="coming-soon-container">
        <h1 className="coming-soon-title">Coming Soon</h1>
        <p className="coming-soon-desc">
          This feature is under development. Stay tuned!
        </p>
        <div className="coming-soon-illustration">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <circle
              cx="60"
              cy="60"
              r="56"
              stroke="#4285f4"
              strokeWidth="6"
              fill="#f5f7fa"
            />
            <path
              d="M40 80 Q60 100 80 80"
              stroke="#4285f4"
              strokeWidth="4"
              fill="none"
            />
            <ellipse cx="50" cy="55" rx="5" ry="8" fill="#4285f4" />
            <ellipse cx="70" cy="55" rx="5" ry="8" fill="#4285f4" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Home
