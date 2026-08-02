import "./SocialButton.css";

/* ------------------------------------------------------------------
   SOCIAL BUTTON — one link, two shapes.
   Desktop: cream square pinned to the bottom-right of the coral panel.
   Mobile:  full-width cream bar across the bottom of the screen.
   The label only shows in the bar; the square has no room for it.
   EDIT: the href and the label below.
------------------------------------------------------------------ */

const X_URL = "https://x.com/aphrodotxyz";
const X_HANDLE = "@aphrodotxyz";

export default function SocialButton() {
  return (
    <a
      className="social-button"
      href={X_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="APHRO. on X"
    >
      {/* Official X mark. currentColor so the button's colour drives it. */}
      <svg className="social-button__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        />
      </svg>
      <span className="social-button__label">Follow {X_HANDLE}</span>
    </a>
  );
}
