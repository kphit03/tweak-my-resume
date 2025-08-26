import React, { useState } from 'react'
import axios from "axios";
import Nav from "./Nav.jsx"

const Login = ({ apiUrl }) => {
  console.log("Test mounted")
  const [output, setOutput] = useState("");
  
  async function getUser() {
    try {
        const res = await axios.get(`${apiUrl}/api/auth/user`, {
            withCredentials: true, //send JSESSIONID cookie
        });
        setOutput(JSON.stringify(res.data, null, 2));
    } catch (err) {
        if (err.response) { 
            setOutput(`Error ${err.response.status}: ${JSON.stringify(err.response.data)}`); // if backend responded with an error status
        } else {
            const message = "Network error"
            setOutput(`Error: ${err.message}`); //network error, no response
        }
    }
}

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
    <button onClick={getUser}>GET USERS</button>
    <div>{output}</div>
    </>
  )
}

export default Login