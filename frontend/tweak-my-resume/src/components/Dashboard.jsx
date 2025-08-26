import React, { useState, useEffect } from 'react';
import axios from "axios";

const Dashboard = ({ apiUrl }) => {
  console.log("dashboard initialized")
  const [output, setOutput] = useState("");

useEffect(() => {
  checkUser();
  console.log("Authenticated!");
})
  async function checkUser() {
    try {
      const res = await axios.get(`${apiUrl}/api/auth/user`, {
        withCredentials: true
      }
    );
    setOutput(JSON.stringify(res.data, null, 2));
  } catch (err) {
    if (err.response) {
      setOutput("Backend:"+ `Error ${err.response.status}: ${JSON.stringify(err.response.data)}`)
    } else {
            const message = "Network error"
            setOutput(`Error: ${err.message}`); //network error, no response
    }
  }
}

  return (
    <>
    <h1>Data: {output ? output : "Not clicked"}</h1>
    </>
  )

}

export default Dashboard