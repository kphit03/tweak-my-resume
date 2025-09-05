import React from 'react'
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <main className={`${styles.page} ${styles.home}`}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.badge}>AI-Powered Resume Tuning</div>
          <h1 className={styles.title}>
            Tailor your resume to every job in <span className={styles.gradient}>seconds</span>.
          </h1>
          <p className={styles.subtitle}>
            Powered by AI, The Resume Tailor analyzes your resume and the job description, then returns
            actionable, ATS-friendly improvements you can apply immediately.
          </p>

          <div className={styles.ctaRow}>
            <Link to="/login" className={styles.ctaPrimary}>
              Get Started
            </Link>
            <a href="#how-it-works" className={styles.ctaGhost}>
              See how it works
            </a>
          </div>

          <div className={styles.heroCard}>
            <div className={styles.heroCardRow}>
              <div className={styles.metric}>
                <span className={styles.metricNum}>10x</span>
                <span className={styles.metricLabel}>Faster tailoring</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricNum}>+35%</span>
                <span className={styles.metricLabel}>More interviews*</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricNum}>ATS</span>
                <span className={styles.metricLabel}>Keyword smart</span>
              </div>
            </div>
            <p className={styles.disclaimer}>*Based on early user feedback.</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.features} id="features">
        <div className={styles.container}>
          <div className={styles.why}>
            <h2 className={styles.h2}>Why The Resume Tailor?</h2>
            <img src="/the-resume-tailor-transparent.png" alt="" />
          </div>
          <div className={styles.grid}>
            <article className={styles.featureCard}>
              <div className={styles.featureIcon}>🎯</div>
              <h3>Job-specific suggestions</h3>
              <p>Paste a job description and get role-targeted bullet rewrites and gaps to close.</p>
            </article>
            <article className={styles.featureCard}>
              <div className={styles.featureIcon}>⚡</div>
              <h3>Instant insights</h3>
              <p>AI surfaces keywords, skills, and quantified wins to boost your impact quickly.</p>
            </article>
            <article className={styles.featureCard}>
              <div className={styles.featureIcon}>✅</div>
              <h3>ATS friendly</h3>
              <p>Clean, scannable output that plays nicely with applicant tracking systems.</p>
            </article>
            <article className={styles.featureCard}>
              <div className={styles.featureIcon}>🔒</div>
              <h3>Secure by default</h3>
              <p>Your data stays private. OAuth login and server-side processing keep it safe.</p>
            </article>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.how} id="how-it-works">
        <div className={styles.container}>
          <h2 className={styles.h2}>How it works</h2>
          <ol className={styles.steps}>
            <li>
              <span className={styles.stepBadge}>1</span>
              <div>
                <h4>Upload your resume (PDF)</h4>
                <p>We extract the text locally in your browser and send it securely for analysis.</p>
              </div>
            </li>
            <li>
              <span className={styles.stepBadge}>2</span>
              <div>
                <h4>Add a job description</h4>
                <p>Paste the job description to tailor recommendations and keyword suggestions to the role.</p>
              </div>
            </li>
            <li>
              <span className={styles.stepBadge}>3</span>
              <div>
                <h4>Apply targeted improvements</h4>
                <p>Get concise bullet rewrites, gaps to close, and ATS keywords to include.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className={styles.quote}>
        <div className={styles.container}>
          <blockquote className={styles.quoteCard}>
            “I tailored my resume to three roles in under 15 minutes and landed two interviews the same week.”
            <footer>— Russ B., Cloud Engineer</footer>
          </blockquote>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className={styles.ctaStrip}>
        <div className={styles.containerStrip}>
          <h3>Ready to tailor your next application?</h3>
          <Link to="/login" className={styles.ctaPrimaryAlt}>
            Try it now
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;