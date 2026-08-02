import { useEffect, useRef, useState } from "react";
import DocsSidebar from "./DocsSidebar";
import DocsArticle from "./DocsArticle";
import DocsToc from "./DocsToc";
import { DOCS_HOME, DOCS_PAGES } from "../../docs/docsContent";
import { to } from "../../lib/links";
import "./DocsLayout.css";

/* ------------------------------------------------------------------
   DOCS SHELL — three columns: sidebar, article, "on this page".

   The shell owns the only scroll container (`.docs__main`), so the
   sidebar and the TOC stay put while the article scrolls. That is why
   the landing page's `overflow: hidden` on <body> can stay untouched:
   docs never rely on document scroll.
------------------------------------------------------------------ */

/* "/docs" -> the first page; "/docs/fees" -> "fees". */
function slugFromPath(path) {
  const rest = path.replace(/^\/docs\/?/, "");
  return rest || DOCS_HOME;
}

export default function DocsLayout({ path, anchor }) {
  const slug = slugFromPath(path);
  const page = DOCS_PAGES[slug];
  const scrollRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Docs manage their own scrolling. The landing page pins <body>, and the
  // mobile media query in index.css unpins it — this class re-pins it for
  // docs at both sizes so the inner panes are the only things that move.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("is-docs");
    document.body.classList.add("is-docs");
    return () => {
      root.classList.remove("is-docs");
      document.body.classList.remove("is-docs");
    };
  }, []);

  // New page: jump to the linked heading if the URL names one, otherwise back
  // to the top. Closing the drawer here covers the mobile tap that got us here.
  useEffect(() => {
    setMenuOpen(false);

    const container = scrollRef.current;
    if (!container) return;

    if (anchor) {
      const target = container.querySelector(`#${CSS.escape(anchor)}`);
      if (target) {
        target.scrollIntoView({ block: "start" });
        return;
      }
    }
    container.scrollTo({ top: 0 });
  }, [slug, anchor]);

  return (
    <div className="docs">
      <header className="docs__topbar">
        <button
          className="docs__menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="docs__menu-icon" aria-hidden="true" />
        </button>

        {/* import.meta.env.BASE_URL = vite.config.js'deki base. Base "/" değilse
            düz "/pp.png" yazmak 404 verir, bu yüzden hep prefix'li kullan. */}
        <a className="docs__brand" href={to("/")} aria-label="APHRO. home">
          <img
            className="docs__brand-logo"
            src={`${import.meta.env.BASE_URL}pp.png`}
            alt="APHRO."
          />
          <span className="docs__brand-label">Docs</span>
        </a>

        <nav className="docs__topbar-links">
          <a className="docs__topbar-link" href={to("/")}>
            Pre-Register
          </a>
        </nav>
      </header>

      <div className="docs__body">
        <DocsSidebar
          activeSlug={slug}
          open={menuOpen}
          onNavigate={() => setMenuOpen(false)}
        />

        {/* Backdrop only exists while the mobile drawer is open. */}
        {menuOpen && (
          <button
            className="docs__backdrop"
            type="button"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
          />
        )}

        <main className="docs__main" ref={scrollRef}>
          {page ? (
            <DocsArticle slug={slug} />
          ) : (
            <div className="docs__missing">
              <h1>Page not found</h1>
              <p>
                No docs page matches <code>{slug}</code>.
              </p>
              <a className="docs-link" href={to(`/docs/${DOCS_HOME}`)}>
                Back to the introduction
              </a>
            </div>
          )}
        </main>

        {page && <DocsToc slug={slug} scrollRef={scrollRef} />}
      </div>
    </div>
  );
}
