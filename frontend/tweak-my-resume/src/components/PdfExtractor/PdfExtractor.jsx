import React, { useState, useRef } from "react";
import axios from "axios";
import { extractPdfText } from "../../pdfText"; //helper function
import "./PdfExtractor.css";
import Spinner from "../Spinner/Spinner.jsx"; // ← inline spinner next to button text

// ---- Client-side limits ----
const MAX_PDF_BYTES = 5 * 1024 * 1024;   // 5 MB cap for uploaded PDF
const MAX_TEXT_CHARS = 100_000;          // ~100k chars cap for extracted text

/**
 * This class handles the logic of actually sending the data to our endpoint to process the resumes
 *  Then, it will return the analyzed data in JSON, Dashboard component will then display the data
 */
const PdfExtractor = ({ apiUrl, onExtracted, onAnalyzed, onError, showPreview, previewChars }) => {
  // store text and error for display later in function
  const fileRef = useRef(null);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [serverResponse, setServerResponse] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  // handle uploading pdfs
  async function handleSubmit(e) {
    // clear any prev state so UI resets each time a user picks a file
    e.preventDefault();
    setError("");
    setText("");
    setServerResponse(null);

    // e.target is the file input in the returned jsx below
    const file = fileRef.current?.files?.[0]; // accept 1 file [0]
    if (!file) return;

    // ---- Early validation: type + size (fast fail before any heavy work) ----
    // Some browsers don't set file.type reliably; extension check is a good fallback
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      const msg = "Please choose a PDF file.";
      setError(msg);
      onError?.(msg);
      if (fileRef.current) fileRef.current.value = ""; // reset picker
      setFileName("");
      return;
    }

    if (file.size > MAX_PDF_BYTES) {
      const human = (file.size / (1024 * 1024)).toFixed(1);
      const msg = `File is too large (${human} MB). Max allowed is ${(MAX_PDF_BYTES / 1024 / 1024)} MB.`;
      setError(msg);
      onError?.(msg);
      if (fileRef.current) fileRef.current.value = ""; // reset picker
      setFileName("");
      return;
    }

    try {
      setLoading(true); // start spinner only after passing quick validations

      // call helper function (which processes pdf and returns string), then set text state var to what we received from function
      const txt = await extractPdfText(file);

      // ---- Extracted text size guard ----
      if (txt.length > MAX_TEXT_CHARS) {
        // OPTION 1 (Strict): Reject if too large (current behavior)
        const msg = `Extracted text is very large (${txt.length.toLocaleString()} chars). Max allowed is ${MAX_TEXT_CHARS.toLocaleString()} chars.`;
        setError(msg);
        onError?.(msg);
        if (fileRef.current) fileRef.current.value = "";
        setFileName("");
        setLoading(false);
        return;
      }

      setText(txt);
      onExtracted?.(txt); // notify parent component (dashboard)

      // after extracting resume data, send to backend
      const url = new URL("/api/analyze/tailor", apiUrl).toString();

      const res = await axios.post(
        url,
        { resumeText: txt, jobDescription: jobDesc, fileName: file.name }, // passed into endpoint to use our backend Analyze service methods on
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );

      // when controller returns JSON, axios parses obj
      setServerResponse(res.data);
      onAnalyzed?.(res.data);
    } catch (err) {
      console.error(err);
      const msg = "Could not read text or send to server.";
      setError(msg);
      onError?.(msg);
    } finally {
      // reset input field
      if (fileRef.current) fileRef.current.value = "";
      setLoading(false);
    }
  }

  return (
    <div className="pdfx-container">
      <h2 className="pdfx-title required-field">Upload your resume (PDF)</h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* Status / errors for screen readers */}
        {error ? (
          <div className="pdfx-status" aria-live="polite" aria-atomic="true">
            {error && <p className="pdfx-error">{error}</p>}
          </div>
        ) : null}

        {/* File input with accessible label */}
        <div className="pdfx-input-row">
          <input
            ref={fileRef}
            id="resume-input"
            type="file"
            accept="application/pdf,.pdf"
            className="pdfx-file-input"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setFileName(f ? f.name : "");
            }}
            title=" "
            required
          />
          <label htmlFor="resume-input" className="pdfx-file-label">
            Choose PDF
          </label>
        </div>

        {/* Reflect the actual enforced size in the helper text */}
        <p className="pdfx-helper">
          Please select a PDF file only. <strong>Max size: 5&nbsp;MB</strong>.
        </p>
        {fileName && (
          <p className="pdfx-helper">
            <strong>File selected:</strong> {fileName}
          </p>
        )}

        <h2 className="pdfx-subtitle">Paste the job description</h2>
        <p className="pdfx-helper">
          A job description is not required for analysis, but it is highly recommended.
        </p>
        <div className="pdfx-textarea-wrap">
          <label htmlFor="jd" className="visually-hidden">Job description</label>
          <textarea
            id="jd"
            className="pdfx-textarea"
            placeholder="Paste the role’s job description here…"
            rows={8}
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            maxLength={20000}
          />
          <div className="pdfx-counter">{jobDesc.length} chars</div>
        </div>

        {/* Submit */}
        <div className="pdfx-textarea-actions">
          <button
            type="submit"
            className="pdfx-file-label pdfx-btn"   // utility class for inline layout
            disabled={loading}
            aria-busy={loading}                    // a11y + CSS hook
          >
            {loading ? (
              <>
                <Spinner size={16} />              {/* spinner next to the text */}
                <span>Processing…</span>
              </>
            ) : (
              <span>Analyze</span>
            )}
          </button>
        </div>
      </form>

      {/* Optional preview of extracted text for dev purposes */}
      {showPreview && text && (
        <div className="pdfx-preview">
          <div className="pdfx-preview-header">
            <h3 className="pdfx-preview-title">Extracted Text Preview</h3>
            <span className="pdfx-preview-count">{text.length} chars</span>
          </div>
          <pre className="pdfx-preview-body">
            {(previewChars ? text.slice(0, previewChars) : text) +
              (previewChars && text.length > previewChars ? "…" : "")}
          </pre>
        </div>
      )}
    </div>
  );
};

export default PdfExtractor;
