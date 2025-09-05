import React, { useState } from "react";
import axios from "axios";
import { extractPdfText } from "../pdfText"; //helper function

const PdfExtractor = ({apiUrl, onExtracted, onAnalyzed, onError, showPreview, previewChars}) => {
  //store text and error for display later in function
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  
  //handle uploading pdfs
  async function handleChange(e) {
    //clear any prev state so UI resets each time a user picks a file
    setError("");
    setText("");

    //e.target is the file input in the returned jsx below
    const file = e.target.files?.[0]; //accept 1 file [0]
    if (!file) return;

    // Some browsers don't set file.type reliably; extension check is a good fallback
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setError("Please choose a PDF file.");
      return;
    }

    try {
      //call helper function (which processes pdf and returns string), then set text state var to what we received from function
      const txt = await extractPdfText(file); 
      setText(txt);
      onExtracted?.(txt); //notify parent component (dashboard)
      //after extracting resume data, send to backend
      const url = new URL("/api/analyze/resume", apiUrl).toString();

      const res = await axios.post(
        url,
        { resumeText: txt }, //passed into endpoint to use our backend Analyze service methods on
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );

      //when controller returns JSON, axios parses obj
      onAnalyzed?.(res.data);
    } catch (err) {
      console.error(err);
      const msg = "Could not read text or send to server."
      setError(msg);
      onError?.(msg);
    } finally {
      // reset input field 
      e.target.value = "";
    }
  }

  return (
    <div className="import-btn-container">
      {/*upload resume button */}
      <input type="file" title=" " accept="application/pdf" onChange={handleChange} className="import-resume-btn"/>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {showPreview ? text : null}
    </div>
  );
};

export default PdfExtractor;
