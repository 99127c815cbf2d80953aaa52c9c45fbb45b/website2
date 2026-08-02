import { DOCS_ORDER, DOCS_PAGES, slugify } from "../../docs/docsContent";
import { to } from "../../lib/links";
import "./DocsArticle.css";

/* ------------------------------------------------------------------
   ARTICLE — renders one page's blocks, plus breadcrumb and prev/next.
   Block shapes and inline syntax are documented in docs/docsContent.js.
------------------------------------------------------------------ */

/* Inline markdown: `code`, **bold**, [label](href). Deliberately tiny —
   enough to write comfortable prose without a markdown dependency.
   The capturing group makes split() keep the delimiters. */
const INLINE_RE = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

function renderInline(text) {
  return String(text)
    .split(INLINE_RE)
    .map((part, index) => {
      if (!part) return null;

      if (part.length > 2 && part.startsWith("`") && part.endsWith("`")) {
        return (
          <code className="docs-article__inline-code" key={index}>
            {part.slice(1, -1)}
          </code>
        );
      }

      if (part.length > 4 && part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }

      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
      if (link) {
        const [, label, href] = link;
        const external = /^https?:/.test(href);
        // Internal hrefs are authored root-relative ("/docs/fees") and get the
        // deploy base prefixed here; "#id" is an in-page heading, left alone.
        const resolved = external || href.startsWith("#") ? href : to(href);
        return (
          <a
            className="docs-link"
            key={index}
            href={resolved}
            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            {label}
          </a>
        );
      }

      return <span key={index}>{part}</span>;
    });
}

function Heading({ level, text }) {
  const id = slugify(text);
  const Tag = level === 2 ? "h2" : "h3";
  return (
    <Tag className={`docs-article__h${level}`} id={id}>
      {text}
      {/* Anchor sits after the text so clicking the heading itself still
          selects, not navigates. */}
      <a className="docs-article__anchor" href={`#${id}`} aria-label={`Link to ${text}`}>
        #
      </a>
    </Tag>
  );
}

function Block({ block }) {
  switch (block.type) {
    case "h2":
      return <Heading level={2} text={block.text} />;
    case "h3":
      return <Heading level={3} text={block.text} />;

    case "p":
      return <p className="docs-article__p">{renderInline(block.text)}</p>;

    case "ul":
      return (
        <ul className="docs-article__ul">
          {block.items.map((item, index) => (
            <li key={index}>{renderInline(item)}</li>
          ))}
        </ul>
      );

    case "ol":
      return (
        <ol className="docs-article__ol">
          {block.items.map((item, index) => (
            <li key={index}>{renderInline(item)}</li>
          ))}
        </ol>
      );

    case "code":
      return (
        <pre className="docs-article__pre" data-lang={block.lang}>
          <code>{block.code}</code>
        </pre>
      );

    case "callout":
      return (
        <aside className={`docs-callout docs-callout--${block.variant || "note"}`}>
          <p className="docs-callout__title">
            <span className="docs-callout__marker" aria-hidden="true">
              {block.variant === "warning" ? "!" : "i"}
            </span>
            {block.title}
          </p>
          <p className="docs-callout__body">{renderInline(block.text)}</p>
        </aside>
      );

    case "table":
      return (
        <div className="docs-article__table-wrap">
          <table className="docs-article__table">
            <thead>
              <tr>
                {block.head.map((cell, index) => (
                  <th key={index}>{renderInline(cell)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
}

export default function DocsArticle({ slug }) {
  const page = DOCS_PAGES[slug];
  const index = DOCS_ORDER.indexOf(slug);
  const prev = index > 0 ? DOCS_ORDER[index - 1] : null;
  const next = index >= 0 && index < DOCS_ORDER.length - 1 ? DOCS_ORDER[index + 1] : null;

  return (
    <article className="docs-article">
      <nav className="docs-article__breadcrumb" aria-label="Breadcrumb">
        <a href={to("/docs")}>Docs</a>
        <span aria-hidden="true">/</span>
        <span>{page.group}</span>
        <span aria-hidden="true">/</span>
        <span className="docs-article__breadcrumb-current">{page.title}</span>
      </nav>

      <h1 className="docs-article__h1">{page.title}</h1>
      <p className="docs-article__lead">{page.description}</p>

      {page.blocks.map((block, index) => (
        <Block block={block} key={index} />
      ))}

      {(prev || next) && (
        <nav className="docs-article__pager" aria-label="Page navigation">
          {prev ? (
            <a className="docs-article__pager-link" href={to(`/docs/${prev}`)}>
              <span className="docs-article__pager-label">Previous</span>
              <span className="docs-article__pager-title">{DOCS_PAGES[prev].title}</span>
            </a>
          ) : (
            <span />
          )}
          {next && (
            <a
              className="docs-article__pager-link docs-article__pager-link--next"
              href={to(`/docs/${next}`)}
            >
              <span className="docs-article__pager-label">Next</span>
              <span className="docs-article__pager-title">{DOCS_PAGES[next].title}</span>
            </a>
          )}
        </nav>
      )}
    </article>
  );
}
