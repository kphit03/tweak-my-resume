import React from 'react';
import styles from './Faq.module.css';
import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
export default function Faq() {
  return (
    <>
      <Nav />

      <main
        className={styles['faq-page']}
        id="faq"
        aria-labelledby="faq-heading"
      >
        <section className={styles['faq-section']}>
          <div className={styles['faq-container']}>
            <h1 id="faq-heading" className={styles['faq-title']}>
              Frequently Asked Questions
            </h1>
            <p className={styles['faq-intro']}>
              Quick answers about using The Resume Tailor.
            </p>

            <nav
              className={styles['faq-toc']}
              aria-label="FAQ table of contents"
            >
              <ul>
                <li><a href="#what-is-trt">What is The Resume Tailor?</a></li>
                <li><a href="#how-to-use">How do I use it?</a></li>
                <li><a href="#file-formats">Which file formats do you support?</a></li>
                <li><a href="#ats">Does it work with ATS systems?</a></li>
                <li><a href="#interviews">Will this guarantee interviews?</a></li>
                <li><a href="#issues">I found an issue—how do I get help?</a></li>
              </ul>
            </nav>

            <div className={styles['faq-list']}>
              <article id="what-is-trt" className={styles['faq-card']}>
                <h2 className={styles['faq-question']}>What is The Resume Tailor?</h2>
                <p className={styles['faq-answer']}>
                  An AI helper that analyzes your resume and a job description to suggest targeted
                  rewrites, keywords, and gaps—optimized for ATS readability.
                </p>
              </article>

              <article id="how-to-use" className={styles['faq-card']}>
                <h2 className={styles['faq-question']}>How do I use it?</h2>
                <p className={styles['faq-answer']}>
                  On the home page, click “Get Started,” upload a PDF resume, paste a job description, then review the
                  suggested bullet rewrites and keyword insights. This is the recommended way to use the application.
                </p>
              </article>

              <article id="file-formats" className={styles['faq-card']}>
                <h2 className={styles['faq-question']}>Which file formats do you support?</h2>
                <p className={styles['faq-answer']}>
                  Currently, only PDF files are supported. DOCX files are on the roadmap to be implemented soon.
                </p>
              </article>

              <article id="ats" className={styles['faq-card']}>
                <h2 className={styles['faq-question']}>Does it work with ATS systems?</h2>
                <p className={styles['faq-answer']}>
                  Yes. Suggestions emphasize clarity, relevant keywords, and clean structure to work
                  well with common ATS parsers.
                </p>
              </article>

              <article id="interviews" className={styles['faq-card']}>
                <h2 className={styles['faq-question']}>Will this guarantee interviews?</h2>
                <p className={styles['faq-answer']}>
                  No tool can guarantee interviews. Tailoring improves clarity and relevance, which
                  often increases callbacks.
                </p>
              </article>

              <article id="issues" className={styles['faq-card']}>
                <h2 className={styles['faq-question']}>I found an issue—how do I get help?</h2>
                <p className={styles['faq-answer']}>
                  Check this FAQ, then reach out through the Contact page with steps to reproduce so
                  we can fix it quickly.
                </p>
              </article>
            </div>
            <a className={styles['faq-back-to-top']} href="#faq-heading">Back to top</a>
          </div>
          
        </section>
        <Footer />
      </main>
    </>
  );
}
