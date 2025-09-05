import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import PdfExtractor from "../PdfExtractor/PdfExtractor.jsx";
import Nav from "../Nav/Nav.jsx"
const Dashboard = ({ apiUrl }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [resumeText, setResumeText] = useState(""); //will be text from child component (PdfExtractor.jsx)
  const [analysis, setAnalysis] = useState(null); //json returned from backend
  const [childError, setChildError] = useState(""); //if error from child
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    async function getUserInfo() {
      try {
        const res = await axios.get(`${apiUrl}/api/auth/me`, { //set GET request to this endpoint
          withCredentials: true,
        });
        if (!cancelled) setUser(res.data); // <-- keep it as an object
        // console.log(res.data) //printing user infor if debugging
      } catch (error) { 
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          const msg =
            error.response?.data?.message || error.message || "Request failed";
          if (!cancelled) setErrorMsg(msg);
          if (status === 401) navigate("/login"); // redirect if not logged in
        } else {
          if (!cancelled) setErrorMsg(String(error));
        }
        console.error("getUserInfo failed:", error);
      }
    }
    getUserInfo();
    return () => {cancelled = true};
  }, [apiUrl, navigate, location.pathname]); // run once (or when apiUrl changes)

  if (!user) return <><Nav /><div><h1>Loading...</h1></div></>;
  if (error) return <h1>{error}</h1>;

  if (user) {
  return (
    <>
    <Nav />
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
          {analysis.fileUploaded && <p><strong>Summary:</strong> {analysis.fileUploaded}</p>}
          
        </>
      )}

    </div>
    </>
  );
}
};

export default Dashboard;