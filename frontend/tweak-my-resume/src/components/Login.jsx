import React, { useState } from 'react'
import axios from "axios";
import Nav from "./Nav.jsx"

const Login = ({ apiUrl }) => {
  console.log("Test mounted")
  const [output, setOutput] = useState("");

  return (
    <>
    <Nav></Nav>
    <div className="login-wrapper">
      <img src="../campaign-tweaking.png" alt="" />
      <div className='login-card'>

        <form type="submit">
        <h2>Sign in or sign up</h2>
        <a href={`${apiUrl}/oauth2/authorization/google`}><img src="../google-icon.png" alt="" id='google-icon'/>Continue with Google</a>
        </form>
        <h1>Env = :{apiUrl}</h1>

      </div>
    </div>
    
    </>
  )
}

export default Login