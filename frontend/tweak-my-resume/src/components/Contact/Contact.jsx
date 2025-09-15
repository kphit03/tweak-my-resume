import React, { useState } from "react";
import Nav from "../Nav/Nav.jsx";
import styles from "./Contact.module.css";
import axios from "axios";
import Spinner from "../Spinner/Spinner.jsx";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter at least 2 characters.").max(80, "Name is too long."),
  email: z.string().trim().email("Please enter a valid email.").max(120, "Email is too long."),
  subject: z.string().trim().max(120, "Subject is too long.")
    // prevent header injection via CR/LF in subject:
    .refine(v => !/[\r\n]/.test(v), "Subject must be a single line."),
  message: z.string().trim().min(10, "Please provide at least 10 characters.").max(4000, "Message is too long.")
});

const Contact = ({ apiUrl }) => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [fieldErr, setFieldErr] = useState({}); // per-field errors
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (fieldErr[name]) {
      // live-clear error as they type
      setFieldErr(errs => ({ ...errs, [name]: "" }));
    }
  }

  function validate() {
    // normalize/trim before validate
    const candidate = {
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    };
    const res = schema.safeParse(candidate);
    if (res.success) return { ok: true, data: res.data };
    // collect field errors
    const errs = {};
    for (const issue of res.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !errs[key]) errs[key] = issue.message;
    }
    setFieldErr(errs);
    return { ok: false };
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", msg: "" });

    const v = validate();
    if (!v.ok) {
      setStatus({ type: "error", msg: "Please fix the highlighted fields." });
      return;
    }

    // safe, trimmed payload to send
    const payload = v.data;

    try {
      setLoading(true);
      const url = new URL("/api/contact", apiUrl).toString();
      await axios.post(url, payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      setStatus({ type: "ok", msg: "Thanks! We’ll get back to you shortly." });
      setForm({ name: "", email: "", subject: "", message: "" });
      setFieldErr({});
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
                <input
                  id="name" name="name" value={form.name} onChange={onChange}
                  aria-invalid={!!fieldErr.name} aria-describedby={fieldErr.name ? "name-err" : undefined}
                  required minLength={2} maxLength={80}
                />
                {fieldErr.name && <p id="name-err" className={styles.errSmall}>{fieldErr.name}</p>}
              </div>

              <div className={styles.row}>
                <label htmlFor="email">Email<span className={styles.req}>*</span></label>
                <input
                  id="email" name="email" type="email" value={form.email} onChange={onChange}
                  aria-invalid={!!fieldErr.email} aria-describedby={fieldErr.email ? "email-err" : undefined}
                  required maxLength={120}
                />
                {fieldErr.email && <p id="email-err" className={styles.errSmall}>{fieldErr.email}</p>}
              </div>

              <div className={styles.row}>
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject" name="subject" value={form.subject} onChange={onChange}
                  aria-invalid={!!fieldErr.subject} aria-describedby={fieldErr.subject ? "subject-err" : undefined}
                  maxLength={120}
                />
                {fieldErr.subject && <p id="subject-err" className={styles.errSmall}>{fieldErr.subject}</p>}
              </div>

              <div className={styles.row}>
                <label htmlFor="message">Message<span className={styles.req}>*</span></label>
                <textarea
                  id="message" name="message" rows={6} value={form.message} onChange={onChange}
                  aria-invalid={!!fieldErr.message} aria-describedby={fieldErr.message ? "message-err" : undefined}
                  required minLength={10} maxLength={4000}
                />
                {fieldErr.message && <p id="message-err" className={styles.errSmall}>{fieldErr.message}</p>}
              </div>

              <div className={styles.actions}>
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
