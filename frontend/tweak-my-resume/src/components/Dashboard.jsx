import React, { useState, useEffect } from "react";
import axios from "axios";
import PdfExtractor from "./PdfExtractor";

const Dashboard = ({ apiUrl }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [resumeText, setResumeText] = useState(""); //will be text from child component (PdfExtractor.jsx)
  const [analysis, setAnalysis] = useState(null); //json returned from backend
  const [childError, setChildError] = useState(""); //if error from child

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
    <div className="dashboard-container">
      <h1>
        Hello, {user.firstName}
      </h1>
      <div>
        <PdfExtractor 
          apiUrl={apiUrl}
          onExtracted={(txt) => setResumeText(txt)}
          onAnalyzed={(data) => setAnalysis(data)}
          onError={(msg) => setChildError(msg)}
          showPreview={false} //debug purposes
          previewChars={800}/>
      </div>
      
      {childError && <p style={{color:"crimson"}}>{childError}</p>}
      {resumeText && <p>Extracted {resumeText.length} chars</p>}
      {analysis && (
        <>
          <h3>Analysis</h3>
          {analysis.summary && <p><strong>Summary:</strong> {analysis.summary}</p>}
          
        </>
      )}

    </div>
  );
};

export default Dashboard;