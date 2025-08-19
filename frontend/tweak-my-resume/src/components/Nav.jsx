import React from 'react'
import { Link } from 'react-router-dom'

const Nav = () => {
  return (
    <div className="navbar">

        <div className="nav-left">
            <Link to="./">Tweak My Resume</Link>
        </div>
        <div className="nav-right">
            <Link to="./login">Login</Link>
        </div>
        
    </div>
  )
}

export default Nav