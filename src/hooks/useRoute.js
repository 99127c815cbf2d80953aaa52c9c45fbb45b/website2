import { useCallback, useEffect, useState } from "react";
import { to } from "../lib/links";

/* ------------------------------------------------------------------
   Minimal path router (History API).

   Real paths, not hashes, because the site is served from the apex
   domain aphrodot.xyz and the docs live at /docs/<slug>. GitHub Pages
   has no SPA rewrite rule, so a hard refresh on /docs/fees would 404 —
   the `postbuild` script in package.json copies index.html to 404.html,
   and Pages serves that for any unknown path. The app then reads the
   real URL and renders the right page, so the deep link works.

   Routes in use:
     /                       landing page
     /docs                   docs, first page
     /docs/<slug>            a specific docs page
     /docs/<slug>#<id>       a specific heading on that page

   Navigation is handled by a single delegated click listener rather
   than a <Link> component: plain <a href> stays in the markup, so the
   links are still real links for middle-click, copy and crawlers.
------------------------------------------------------------------ */

function readRoute() {
  const base = to("/").replace(/\/$/, ""); // "" when base is "/"
  let path = window.location.pathname;
  if (base && path.startsWith(base)) path = path.slice(base.length);

  return {
    // Trailing slashes are stripped so "/docs/" and "/docs" are one route.
    path: path.replace(/\/+$/, "") || "/",
    anchor: window.location.hash.replace(/^#/, ""),
  };
}

export default function useRoute() {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onPopState = () => setRoute(readRoute());

    function onClick(event) {
      // Let the browser handle anything that isn't a plain left-click, so
      // cmd-click still opens a new tab.
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = event.target.closest?.("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return; // external link

      event.preventDefault();
      const next = url.pathname + url.search + url.hash;
      if (next !== window.location.pathname + window.location.search + window.location.hash) {
        window.history.pushState({}, "", next);
      }
      setRoute(readRoute());
    }

    window.addEventListener("popstate", onPopState);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const navigate = useCallback((next) => {
    window.history.pushState({}, "", to(next));
    setRoute(readRoute());
  }, []);

  return { path: route.path, anchor: route.anchor, navigate };
}
