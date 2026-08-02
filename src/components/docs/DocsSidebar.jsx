import { useEffect, useMemo, useRef, useState } from "react";
import { DOCS_NAV, DOCS_PAGES, searchDocs } from "../../docs/docsContent";
import { to } from "../../lib/links";
import "./DocsSidebar.css";

/* ------------------------------------------------------------------
   SIDEBAR — search box + collapsible groups.

   Typing in the search box swaps the group tree for a result list;
   clearing it puts the tree back. ⌘K / Ctrl+K focuses the box, Esc
   clears it.
------------------------------------------------------------------ */

export default function DocsSidebar({ activeSlug, open, onNavigate }) {
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);

  // Groups start expanded; collapsing is remembered per group title.
  const [collapsed, setCollapsed] = useState(() => new Set());

  useEffect(() => {
    function onKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const results = useMemo(() => searchDocs(query), [query]);
  const searching = query.trim().length > 0;

  function toggleGroup(title) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  return (
    <aside
      className={`docs-sidebar${open ? " docs-sidebar--open" : ""}`}
      aria-label="Docs navigation"
    >
      <div className="docs-sidebar__search">
        <svg className="docs-sidebar__search-icon" viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M13.2 13.2 17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          ref={searchRef}
          className="docs-sidebar__search-input"
          type="search"
          value={query}
          placeholder="Search"
          aria-label="Search the docs"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setQuery("");
          }}
        />
        <kbd className="docs-sidebar__kbd">⌘K</kbd>
      </div>

      <nav className="docs-sidebar__nav">
        {searching ? (
          results.length ? (
            <ul className="docs-sidebar__results">
              {results.map((result) => (
                <li key={result.slug}>
                  <a
                    className={`docs-sidebar__result${
                      result.slug === activeSlug ? " docs-sidebar__result--active" : ""
                    }`}
                    href={to(`/docs/${result.slug}`)}
                    onClick={onNavigate}
                  >
                    <span className="docs-sidebar__result-title">{result.title}</span>
                    <span className="docs-sidebar__result-group">{result.group}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="docs-sidebar__empty">No results for “{query.trim()}”.</p>
          )
        ) : (
          DOCS_NAV.map((group) => {
            const isCollapsed = collapsed.has(group.title);
            return (
              <div className="docs-sidebar__group" key={group.title}>
                <button
                  className="docs-sidebar__group-title"
                  type="button"
                  aria-expanded={!isCollapsed}
                  onClick={() => toggleGroup(group.title)}
                >
                  <svg
                    className={`docs-sidebar__chevron${
                      isCollapsed ? " docs-sidebar__chevron--collapsed" : ""
                    }`}
                    viewBox="0 0 12 12"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 4.5 6 8l3-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {group.title}
                </button>

                {!isCollapsed && (
                  <ul className="docs-sidebar__list">
                    {group.pages.map((slug) => (
                      <li key={slug}>
                        <a
                          className={`docs-sidebar__link${
                            slug === activeSlug ? " docs-sidebar__link--active" : ""
                          }`}
                          href={to(`/docs/${slug}`)}
                          aria-current={slug === activeSlug ? "page" : undefined}
                          onClick={onNavigate}
                        >
                          {DOCS_PAGES[slug].title}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })
        )}
      </nav>
    </aside>
  );
}
