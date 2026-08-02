import { useEffect, useMemo, useState } from "react";
import { getPageHeadings } from "../../docs/docsContent";
import { to } from "../../lib/links";
import "./DocsToc.css";

/* ------------------------------------------------------------------
   ON THIS PAGE — headings for the current page, with the one you are
   reading highlighted.

   Active-heading tracking is a scroll listener rather than an
   IntersectionObserver: the article scrolls inside `.docs__main`, not
   the document, and "the last heading above the fold" is exactly the
   rule readers expect. rAF keeps it to one measurement per frame.
------------------------------------------------------------------ */

// How far below the top of the scroll pane a heading counts as "current".
const ACTIVE_OFFSET = 96;

export default function DocsToc({ slug, scrollRef }) {
  const headings = useMemo(() => getPageHeadings(slug), [slug]);
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    setActiveId(headings[0]?.id ?? "");

    const container = scrollRef.current;
    if (!container || !headings.length) return;

    const nodes = headings
      .map((heading) => ({ id: heading.id, el: container.querySelector(`#${CSS.escape(heading.id)}`) }))
      .filter((entry) => entry.el);
    if (!nodes.length) return;

    let frame = 0;

    function measure() {
      frame = 0;
      const top = container.getBoundingClientRect().top;

      // Bottom of the pane: the last heading wins, otherwise a short final
      // section could never become active.
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 4) {
        setActiveId(nodes[nodes.length - 1].id);
        return;
      }

      let current = nodes[0].id;
      for (const node of nodes) {
        if (node.el.getBoundingClientRect().top - top <= ACTIVE_OFFSET) current = node.id;
        else break;
      }
      setActiveId(current);
    }

    function onScroll() {
      if (!frame) frame = window.requestAnimationFrame(measure);
    }

    measure();
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [headings, scrollRef, slug]);

  if (!headings.length) return null;

  return (
    <aside className="docs-toc" aria-label="On this page">
      <p className="docs-toc__title">On this page</p>
      <ul className="docs-toc__list">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              className={`docs-toc__link docs-toc__link--h${heading.level}${
                heading.id === activeId ? " docs-toc__link--active" : ""
              }`}
              /* Full route + heading id, so the link survives a reload and a
                 copy-paste. */
              href={to(`/docs/${slug}`) + `#${heading.id}`}
              onClick={() => {
                // Re-clicking the heading you are already on leaves the URL
                // unchanged, so no route effect fires — scroll here instead.
                scrollRef.current
                  ?.querySelector(`#${CSS.escape(heading.id)}`)
                  ?.scrollIntoView({ block: "start", behavior: "smooth" });
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
