import React from 'react'
import { Link } from 'react-router-dom'

const Nav = () => {
  return (
    <>
    <div className="navbar">

        <div className="nav-left">
            <Link to="./"><img src="../campaign-tweaking.png" alt="" /></Link>
            <Link to="./"><span>Tweak My Resume</span></Link>
        </div>
        <div className="nav-mid">
            <Link to="./">Home</Link>
            <Link to="./about">About</Link>
            <Link to="./faq">FAQ</Link>
            <Link to="./support">Contact</Link>
        </div>
        <div className="nav-right">
            <Link to="./login" id="login-btn">Login</Link>
        </div>
        
    </div>
    </>
  )

}

export default Nav