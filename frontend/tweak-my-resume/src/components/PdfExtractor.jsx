import React, { useState } from "react";
import axios from "axios";
import { extractPdfText } from "../pdfText"; //helper function

const PdfExtractor = ({apiUrl}) => {
  //store text and error for display later in function
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [serverMsg, setServerMsg] = useState("");
  
  //handle uploading pdfs
  async function handleChange(e) {
    //clear any prev state so UI resets each time a user picks a file
    setError("");
    setText("");
    setServerMsg("");

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
      //after extracting resume data, send to backend
      const res = await axios.post(
        `${apiUrl}/api/analyze/resume`,
        { resumeText: txt },
        { withCredentials: true, header: { "Content-Type": "application/json" } }
      );
      setServerMsg(res.data); //controller will return simple string here

    } catch (err) {
      console.error(err);
      setError(
        "Could send text to server. Please submit a PDF (Not scanned)."
      );
    } finally {
      // reset input field 
      e.target.value = "";
    }
  }

  return (
    <div>
      {/*upload resume button */}
      <input type="file" accept="application/pdf" onChange={handleChange} />
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {text && (
        <>
          <div>
            <h3 style={{ margin: "16px 0" }}>Extracted text</h3>
          </div>
          <pre
          //temp styling
            style={{
              whiteSpace: "pre-wrap",
              background: "#f6f8fa",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 12,     
              overflow: "auto", 
            }}
          >
            {text}                
          </pre>
        </>
      )}
    </div>
  );
};

export default PdfExtractor;
