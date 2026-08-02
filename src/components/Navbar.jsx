import { to } from "../lib/links";
import "./Navbar.css";

/* ------------------------------------------------------------------
   NAVBAR — fixed, blends into the page background (no bar/edge/shadow).
   Logo left + small wordmark beside it.
   EDIT COPY: the wordmark spans below.
------------------------------------------------------------------ */

export default function Navbar() {
  return (
    <header className="navbar">
      {/* pp.png is itself the APHRO. wordmark, so no text wordmark beside it —
          that would render the brand name twice. Swap in an icon/avatar and
          uncomment the span in Navbar.css notes if that ever changes. */}
      {/* import.meta.env.BASE_URL = vite.config.js'deki base. Base "/" değilse
          düz "/pp.png" yazmak 404 verir, bu yüzden hep prefix'li kullan. */}
      <a className="navbar__brand" href={import.meta.env.BASE_URL} aria-label="APHRO. home">
        <img
          className="navbar__logo"
          src={`${import.meta.env.BASE_URL}pp.png`}
          alt="APHRO."
        />
      </a>

      {/* Sits beside the logo, over the cream half — coral type needs a cream
          background, and the right half of the split is coral. */}
      <nav className="navbar__nav">
        <a className="navbar__link" href={to("/docs")}>
          Docs
        </a>
      </nav>
    </header>
  );
}
