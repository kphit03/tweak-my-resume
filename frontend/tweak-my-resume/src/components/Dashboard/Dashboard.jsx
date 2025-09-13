import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import PdfExtractor from "../PdfExtractor/PdfExtractor.jsx";
import Nav from "../Nav/Nav.jsx";
import Spinner from "../Spinner/Spinner.jsx";
import styles from "./Dashboard.module.css"; // NOTE: CSS module for overlay + layout

const Dashboard = ({ apiUrl }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [resumeText, setResumeText] = useState(""); //will be text from child component (PdfExtractor.jsx)
  const [analysis, setAnalysis] = useState(null); //json returned from backend
  const [childError, setChildError] = useState(""); //if error from child
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let cancelled = false; // NOTE: prevents state updates if unmounted
    const controller = new AbortController(); // NOTE: abort in-flight request on unmount/navigate

    setLoading(true); // NOTE: set loading BEFORE starting the request

    async function getUserInfo() {
      try {
        const res = await axios.get(`${apiUrl}/api/auth/me`, { //set GET request to this endpoint
          withCredentials: true,
          signal: controller.signal, // NOTE: tie axios to AbortController
        });
        if (!cancelled) setUser(res.data); // <-- keep it as an object

        // console.log(res.data) //printing user infor if debugging
      } catch (error) {
        if (!cancelled) {
          if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const msg =
              error.response?.data?.message || error.message || "Request failed";
            setError(msg);
            if (status === 401) navigate("/login"); // redirect if not logged in
          } else {
            // NOTE: you had setErrorMsg here; matching your state name:
            setError(String(error));
          }
        }
        console.error("getUserInfo failed:", error);
      } finally {
        if (!cancelled) setLoading(false); // NOTE: stop spinner in finally
      }
    }

    getUserInfo();

    return () => {
      cancelled = true;
      controller.abort(); // NOTE: cancels the request to avoid memory leaks/race
    };
  }, [apiUrl, navigate, location.pathname]); // run once (or when apiUrl changes)

  // NOTE: Show a centered page-level spinner for the initial load (before we have a user)
  if (loading && !user) {
    return (
      <>
        <Nav />
        <main className={styles.center}>
          <Spinner size={128} label="Loading dashboard…" />
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Nav />
        <main className={styles.center}>
          <p style={{ color: "crimson" }}>{error}</p>
        </main>
      </>
    );
  }

  if (!user) {
    // NOTE: Fallback if something else delays user; minimal text to avoid spinner duplication
    return (
      <>
        <Nav />
        <main className={styles.center}>
          <p>Loading…</p>
        </main>
      </>
    );
  }

  if (user) {
    return (
      <>
        <Nav />
        {loading && (
          <div className={styles.overlay} aria-hidden="true">
            <Spinner size={128} />
          </div>
        )}

        <div className={styles.container}>
          <h1>
            Hello, {user.firstName}, <br /><h2 className={styles.headH2}>Upload your resume below to get started</h2>
          </h1>

          <div className={styles.card}>
            <PdfExtractor
              apiUrl={apiUrl}
              onExtracted={(txt) => setResumeText(txt)}
              onAnalyzed={(data) => setAnalysis(data)}
              onError={(msg) => setChildError(msg)}
              showPreview={false} //debug purposes
              previewChars={800}
            />
          </div>

          {childError && <p style={{ color: "crimson" }}>{childError}</p>}

          {/* ---------- Analysis UI (renders once PdfExtractor returns JSON) ---------- */}
          {analysis && (
            <>
              {/* NOTE: Analysis results card */}
              <section className={styles.analysis}>
                <header className={styles.analysisHeader}>
                  <div className={styles.file}>
                    <span className={styles.fileLabel}>File:</span>
                    <span className={styles.fileName}>
                      {analysis.fileUploaded || "—"}
                    </span>
                  </div>

                  <h2 className={styles.h2}>Tailored Analysis</h2>

                  {analysis.summary && (
                    <p className={styles.summary}>{analysis.summary}</p>
                  )}
                </header>

                {/* Strengths & Gaps */}
                <div className={styles.grid2}>
                  <div className={styles.section}>
                    <h3 className={styles.h3}>Strengths</h3>
                    <ul className={styles.list}>
                      {(analysis.strengths ?? []).map((item, i) => (
                        <li key={`str-${i}`}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.section}>
                    <h3 className={styles.h3}>Gaps</h3>
                    <ul className={styles.listWarn}>
                      {(analysis.gaps ?? []).map((item, i) => (
                        <li key={`gap-${i}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tailored bullets */}
                <div className={styles.section}>
                  <h3 className={styles.h3}>Tailored Bullet Suggestions</h3>
                  <ol className={styles.olist}>
                    {(analysis.tailoredBullets ?? []).map((b, i) => (
                      <li key={`tb-${i}`}>{b}</li>
                    ))}
                  </ol>
                </div>

                {/* ATS keywords as pills */}
                <div className={styles.section}>
                  <h3 className={styles.h3}>ATS Keyword Considerations</h3>
                  <div className={styles.pills}>
                    {(analysis.atsKeywords ?? []).map((kw, i) => (
                      <span className={styles.pill} key={`kw-${i}`}>{kw}</span>
                    ))}
                  </div>
                </div>

                {/* Key recommendations */}
                <div className={styles.section}>
                  <h3 className={styles.h3}>Key Recommendations</h3>
                  <ul className={styles.listCheck}>
                    {(analysis.keyRecommendations ?? []).map((rec, i) => (
                      <li key={`rec-${i}`}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </section>
            </>
          )}

        </div>
      </>
    );
  }

  return null; // NOTE: unreachable, but keeps TS/linters happy if added later
};

export default Dashboard;
