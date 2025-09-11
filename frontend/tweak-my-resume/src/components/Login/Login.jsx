import React from "react";
import { Link } from "react-router-dom";
import styles from "./Login.module.css";

const Login = () => {
  // Spring Security default Google login endpoint:
  const googleLoginUrl = "http://localhost:8080/oauth2/authorization/google";

  return (
    
    <main className={`${styles.scope} ${styles.wrap}`}>
      <h1 id="login-title" className={styles.title}>Sign in to The Resume Tailor</h1>
      <section className={styles.card} role="dialog" aria-labelledby="login-title">
        <div className={styles.backRow}>
            <Link to="/" className={styles.backBtn}>
              Back to Home
            </Link>
        </div>

        <div className={styles.logoRow}>
          <img
            src="/the-resume-tailor-transparent.png"
            alt="The Resume Tailor logo"
            className={styles.logo}
          />
        </div>
        <p className={styles.subtitle}>
          Sign in to tailor your resume to any job description using AI.
        </p>

        <a href={googleLoginUrl} className={styles.googleBtn}>
          <img
            src="/google-icon.png"
            alt=""
            aria-hidden="true"
            className={styles.googleIcon}
          />
          Continue with Google
        </a>

        <p className={styles.disclaimer}>
          By continuing you agree to our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.
        </p>
      </section>
    </main>
  );
};

export default Login;
