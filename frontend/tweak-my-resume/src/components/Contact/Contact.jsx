import React, { useState } from "react";
import Nav from "../Nav/Nav.jsx";
import styles from "./Contact.module.css";
import axios from "axios";
import Spinner from "../Spinner/Spinner.jsx"; 
const Contact = ({ apiUrl }) => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", msg: "" });

    // basic client validation
    if (!form.name || !form.email || !form.message) {
      setStatus({ type: "error", msg: "Name, email, and message are required." });
      return;
    }

    try {
      setLoading(true);
      const url = new URL("/api/contact", apiUrl).toString();
      //send form data to backend
      await axios.post(url, form, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      setStatus({ type: "ok", msg: "Thanks! We’ll get back to you shortly." });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", msg: "Could not send message. Please try again later." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Nav />
      <main className={styles.scope}>
        <section className={styles.wrap}>
          <div className={styles.card}>
            <h1 className={styles.title}>Contact Us</h1>
            <p className={styles.sub}>Questions, feedback, or partnership ideas—drop us a note.</p>

            <form onSubmit={onSubmit} noValidate>
              <div className={styles.row}>
                <label htmlFor="name">Name<span className={styles.req}>*</span></label>
                <input id="name" name="name" value={form.name} onChange={onChange} required />
              </div>

              <div className={styles.row}>
                <label htmlFor="email">Email<span className={styles.req}>*</span></label>
                <input id="email" name="email" type="email" value={form.email} onChange={onChange} required />
              </div>

              <div className={styles.row}>
                <label htmlFor="subject">Subject</label>
                <input id="subject" name="subject" value={form.subject} onChange={onChange} />
              </div>

              <div className={styles.row}>
                <label htmlFor="message">Message<span className={styles.req}>*</span></label>
                <textarea id="message" name="message" rows={6} value={form.message} onChange={onChange} required />
              </div>

              <div className={styles.actions}>
                {/* When loading, show spinner + "Sending…" and disable the button */}
                <button
                  type="submit"
                  className={loading ? `${styles.isLoading}` : undefined}
                  disabled={loading}
                  aria-busy={loading ? "true" : "false"}
                  aria-live="polite"
                >
                  {loading && (
                    <span className={styles.inlineSpinner}>
                      <Spinner size={16} />
                    </span>
                  )}
                  {loading ? "Sending…" : "Send message"}
                </button>
              </div>

              {status.msg && (
                <p className={status.type === "ok" ? styles.ok : styles.err}>
                  {status.msg}
                </p>
              )}
            </form>
          </div>
        </section>
      </main>
    </>
  );
};

export default Contact;
