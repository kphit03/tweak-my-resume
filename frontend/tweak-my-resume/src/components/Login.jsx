import React from 'react'
import Nav from "./Nav.jsx"
const Login = () => {
  return (
    <>
    <Nav></Nav>
    <div className="login-wrapper">
      <img src="../campaign-tweaking.png" alt="" />
      <div className='login-card'>
        <form type="submit">
        <h2>Sign in or sign up</h2>
        <button><img src="../google-icon.png" alt="" id='google-icon'/>Continue with Google</button>
        </form>

      </div>
    </div>
    
    </>
  )
}

export default Login