import { useState } from "react";
import { savePreRegistration } from "../lib/preregister";
import "./PreRegisterPanel.css";

/* ------------------------------------------------------------------
   PRE-REGISTER — right half (bottom on mobile). Coral panel, edge-to-edge.
   Submit writes one Firestore document per email; see lib/preregister.js
   for the storage details and firestore.rules for what the server allows.
   EDIT COPY: heading, subheading, button label, success message below.
------------------------------------------------------------------ */

// Pragmatic email check — matches what most signup forms accept.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function PreRegisterPanel() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return; // double-click guard

    const value = email.trim();

    if (!value) {
      setError("Please enter your email address.");
      return;
    }
    if (!EMAIL_RE.test(value)) {
      setError("That doesn't look like a valid email.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await savePreRegistration(value);
      setSubmitted(true);
    } catch (err) {
      // Network failure or a rules rejection we did not expect. Keep the form
      // filled in so they can retry without retyping.
      console.error("[APHRO.] pre-register failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(event) {
    setEmail(event.target.value);
    if (error) setError(""); // clear the error as soon as they start fixing it
  }

  return (
    <section className="prereg">
      <div className="prereg__inner">
        {submitted ? (
          <div className="prereg__success" role="status">
            <h2 className="prereg__heading">Thanks, we'll notify you!</h2>
            <p className="prereg__sub">
              You're on the list. Watch your inbox; we only send the good news.
            </p>
          </div>
        ) : (
          <>
            <h2 className="prereg__heading">Be the first to know</h2>
            <p className="prereg__sub">
              Pre-register for early access to the first APHRO. release.
            </p>

            <form className="prereg__form" onSubmit={handleSubmit} noValidate>
              <label className="prereg__label" htmlFor="prereg-email">
                Email address
              </label>
              <div className="prereg__row">
                <input
                  id="prereg-email"
                  className={`prereg__input${error ? " prereg__input--error" : ""}`}
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={submitting}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "prereg-error" : undefined}
                />
                <button className="prereg__button" type="submit" disabled={submitting}>
                  {submitting ? "Sending…" : "Pre-Register"}
                </button>
              </div>
              {error && (
                <p className="prereg__error" id="prereg-error" role="alert">
                  {error}
                </p>
              )}
            </form>
          </>
        )}
      </div>
    </section>
  );
}
