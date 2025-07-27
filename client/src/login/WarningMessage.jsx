import React from 'react'
import './WarningMessage.scss'

const WarningMessage = ({ message, image, alt }) => {
  return (
    <div className="warning-message">
      {image && (
        <img src={image} alt={alt || 'Warning'} className="warning-image" />
      )}
      <div className="warning-text">{message}</div>
    </div>
  )
}

export default WarningMessage
