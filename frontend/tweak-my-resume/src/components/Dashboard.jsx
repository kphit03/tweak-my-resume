import React, { useState, useEffect } from "react";
import axios from "axios";
import PdfExtractor from "./PdfExtractor";

const Dashboard = ({ apiUrl }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getUserInfo() {
      try {
        const res = await axios.get(`${apiUrl}/api/auth/me`, { //set GET request to this endpoint
          withCredentials: true,
        });
        setUser(res.data); // <-- keep it as an object
        // console.log(res.data) //printing user infor if debugging
      } catch (err) {
        setError(
          err.response
            ? `Backend error ${err.response.status}: ${JSON.stringify(err.response.data)}`
            : `Network error: ${err.message}`
        );
      }
    }
    getUserInfo();
  }, [apiUrl]); // run once (or when apiUrl changes)

  if (error) return <h1>{error}</h1>;
  if (!user) return <h1>Loading...</h1>;

  return (
    <>
      <h1>
        Hello, {user.firstName} {user.lastName}
      </h1>
      <div>
        <PdfExtractor apiUrl={apiUrl}/>
      </div>
    </>
  );
};

export default Dashboard;