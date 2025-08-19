import React from 'react'
import { Link } from 'react-router-dom'

const InvalidUrl = () => {
  return (
    <div className="error-message-url">
        <h1>Oops! You just tried going to a url that does not exist.</h1>
        <Link to="/">Click to go back to home</Link>
    </div>
  )
}

export default InvalidUrl