/* ============================================================
   APHRO. DOCS — all copy lives in this file.

   HOW TO EDIT
   -----------
   1. Change wording: edit the `blocks` array of a page below.
   2. Add a page: add an entry to DOCS_PAGES, then list its slug in
      the matching DOCS_NAV group. Order in DOCS_NAV drives the
      sidebar order and the prev/next footer links.
   3. The right-hand "On this page" list is generated automatically
      from every `h2` / `h3` block — you never maintain it by hand.

   BLOCK TYPES
   -----------
   { type: "h2",   text }                        section heading (in the TOC)
   { type: "h3",   text }                        sub-heading (in the TOC)
   { type: "p",    text }                        paragraph
   { type: "ul",   items: [] }                   bullet list
   { type: "ol",   items: [] }                   numbered list
   { type: "code", lang, code }                  code block
   { type: "callout", variant, title, text }     variant: "note" | "warning"
   { type: "table", head: [], rows: [[]] }       simple table

   INLINE FORMATTING (works in any `text` or list item)
   ----------------------------------------------------
   `code`   **bold**   [label](https://example.com)   [label](/docs/slug)
   ============================================================ */

export const DOCS_PAGES = {
  /* ---------------------------------------------------------- */
  introduction: {
    group: "Getting Started",
    title: "Introduction",
    description:
      "APHRO. is a creator subscription platform where payments settle on-chain and content stays encrypted end-to-end.",
    blocks: [
      {
        type: "p",
        text: "APHRO. connects creators and their audience directly. Subscriptions, tips and pay-per-view unlocks settle on-chain to the creator's own wallet, and every upload is encrypted before it leaves the device. There is no payment processor in the middle and no plaintext copy of your content on our servers.",
      },
      {
        type: "callout",
        variant: "note",
        title: "Pre-launch",
        text: "APHRO. has not launched yet. These docs describe the shipping design and will grow as each piece goes live. [Pre-register](/) to get early access.",
      },
      { type: "h2", text: "Core principles" },
      {
        type: "ul",
        items: [
          "**Direct settlement:** subscription revenue lands in the creator's wallet, not in a platform balance that has to be withdrawn.",
          "**Encrypted by default:** media is encrypted client-side; access keys are handed out per subscriber.",
          "**Self-custody:** creators and fans keep their own keys. APHRO. never holds funds it could freeze.",
          "**No algorithmic gatekeeping:** a creator's subscribers see everything the creator publishes, in order.",
          "**Verifiable rules:** pricing, payout splits and expiry live in smart contracts anyone can read.",
        ],
      },
      { type: "h2", text: "Who it is for" },
      {
        type: "ul",
        items: [
          "**Creators** who want instant payouts, portable audiences and no arbitrary deplatforming.",
          "**Fans** who want to pay without exposing card details or their real identity.",
          "**Builders** who want to plug the payment and access layer into their own front end.",
        ],
      },
      { type: "h2", text: "Next steps" },
      {
        type: "ul",
        items: [
          "[Quick Start](/docs/quick-start): get an account running in a few minutes.",
          "[How It Works](/docs/how-it-works): the flow from upload to unlock.",
          "[Encryption](/docs/encryption): what protects the content itself.",
        ],
      },
    ],
  },

  /* ---------------------------------------------------------- */
  "quick-start": {
    group: "Getting Started",
    title: "Quick Start",
    description:
      "Connect a wallet, set up a profile and publish or subscribe to your first piece of content.",
    blocks: [
      {
        type: "p",
        text: "Everything on APHRO. starts with a wallet. You do not create a password and there is no email-and-card signup step.",
      },
      { type: "h2", text: "Prerequisites" },
      {
        type: "ul",
        items: [
          "A self-custody wallet (browser extension or mobile, WalletConnect-compatible).",
          "A small balance of the network's gas token for the first transaction.",
          "A stablecoin balance if you plan to subscribe.",
        ],
      },
      { type: "h2", text: "For creators" },
      {
        type: "ol",
        items: [
          "**Connect your wallet.** This wallet becomes your payout address and your identity on the platform.",
          "**Create your profile.** Handle, bio, avatar and banner. Public metadata only; nothing here is encrypted.",
          "**Set your tiers.** Give each tier a monthly price and a description. Prices are quoted in stablecoins.",
          "**Publish your first post.** Media is encrypted in the browser before upload, then pinned to decentralised storage.",
          "**Share your page.** Subscribers pay straight to your wallet; nothing is held back for a payout cycle.",
        ],
      },
      { type: "h2", text: "For fans" },
      {
        type: "ol",
        items: [
          "**Connect your wallet.** No email, no card, no identity document.",
          "**Open a creator's page.** Free posts are visible immediately; locked posts show a price and a preview.",
          "**Subscribe or unlock.** Approve the transaction; your access key is issued as soon as it confirms.",
          "**View content.** Decryption happens locally in your client, so the plaintext never touches a server.",
        ],
      },
      { type: "h2", text: "Managing a subscription" },
      {
        type: "p",
        text: "Subscriptions are recurring allowances, not open-ended card mandates. You approve a spending limit once, and each renewal draws from it until you revoke it.",
      },
      {
        type: "code",
        lang: "text",
        code: `Subscription
  creator   0xCREATOR…
  tier      "Standard"
  price     12.00 USDC / 30 days
  renews    auto, from the approved allowance
  cancel    revoke the allowance; access runs to the paid period's end`,
      },
      {
        type: "callout",
        variant: "warning",
        title: "Your keys are your account",
        text: "Lose the wallet and you lose the profile, the earnings history and access to anything you unlocked. Back up your recovery phrase before you upload or pay for anything.",
      },
    ],
  },

  /* ---------------------------------------------------------- */
  "how-it-works": {
    group: "Platform",
    title: "How It Works",
    description:
      "The end-to-end path a post takes from a creator's device to a paying subscriber's screen.",
    blocks: [
      {
        type: "p",
        text: "APHRO. splits into three layers: a **content layer** that stores encrypted media, an **access layer** that decides who holds which key, and a **payment layer** that moves money on-chain. Each one can be audited on its own.",
      },
      { type: "h2", text: "Publishing" },
      {
        type: "ol",
        items: [
          "The creator's client generates a fresh content key for the post.",
          "Media is encrypted with that key locally, then uploaded, so the server only ever receives ciphertext.",
          "The ciphertext goes to decentralised storage and its content address is recorded on-chain with the post's price and tier.",
        ],
      },
      { type: "h2", text: "Paying" },
      {
        type: "ol",
        items: [
          "A fan sends a subscription or unlock payment to the creator's contract.",
          "The contract splits the amount according to the creator's payout rules and forwards it. Settlement is the same transaction, so there is no pending period.",
          "The payment receipt is what proves entitlement; no account flag or database row can contradict it.",
        ],
      },
      { type: "h2", text: "Unlocking" },
      {
        type: "ol",
        items: [
          "The fan's client presents the on-chain receipt to the access layer.",
          "The content key is re-wrapped for that fan's key pair and delivered to their client.",
          "The client fetches the ciphertext and decrypts it in memory for playback.",
        ],
      },
      { type: "h2", text: "What APHRO. can and cannot see" },
      {
        type: "table",
        head: ["Data", "Visible to APHRO."],
        rows: [
          ["Profile, handle, tier prices", "Yes, public by design"],
          ["Payment amounts and timing", "Yes, public on-chain"],
          ["Uploaded media", "No, encrypted before upload"],
          ["Direct messages", "No, end-to-end encrypted"],
          ["Legal identity of a fan", "No, wallet addresses only"],
        ],
      },
      {
        type: "callout",
        variant: "note",
        title: "Pseudonymous, not anonymous",
        text: "Wallet activity is public. A wallet that is already linked to your identity elsewhere stays linked here. See [Privacy](/docs/privacy).",
      },
    ],
  },

  /* ---------------------------------------------------------- */
  "for-creators": {
    group: "Platform",
    title: "For Creators",
    description:
      "Tiers, pay-per-view, collaboration splits and what the earnings dashboard reports.",
    blocks: [
      { type: "h2", text: "Ways to earn" },
      {
        type: "ul",
        items: [
          "**Subscription tiers:** recurring monthly access. Up to five tiers per profile, each with its own price and perks.",
          "**Pay-per-view:** a one-off price on a single post, visible to subscribers and non-subscribers alike.",
          "**Tips:** an unrestricted transfer, optionally attached to a post or a message.",
          "**Bundles:** a discounted multi-month prepayment for a tier.",
        ],
      },
      { type: "h2", text: "Payouts" },
      {
        type: "p",
        text: "There is no payout schedule because there is nothing to pay out. Funds move to your wallet in the same transaction that charges the fan, so your balance is your wallet balance.",
      },
      { type: "h2", text: "Collaboration splits" },
      {
        type: "p",
        text: "A post can name multiple payees with fixed percentages. The contract enforces the split at payment time, so a collaborator does not have to trust anyone to forward their share later.",
      },
      {
        type: "code",
        lang: "text",
        code: `Post payout rules
  0xCREATOR…    70%
  0xGUEST…      25%
  0xREFERRER…    5%
  ── enforced on-chain, per payment`,
      },
      { type: "h2", text: "Dashboard" },
      {
        type: "ul",
        items: [
          "Active subscribers per tier, plus joins and churn over time.",
          "Revenue by source: subscriptions, unlocks, tips, bundles.",
          "Post-level performance: views and unlock conversion.",
          "A full transaction log, each row linking to its on-chain proof.",
        ],
      },
      { type: "h2", text: "Content rules" },
      {
        type: "p",
        text: "Creators must be adults, must hold the rights to what they publish, and must have documented consent from everyone appearing in it. Non-consensual material, content involving minors, and content that is illegal where it is produced are prohibited and are grounds for removal from the front end.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Removal has limits",
        text: "APHRO. can delist a profile from its own interface, but it cannot claw back funds already settled or delete a copy someone else has already decrypted. Take-down mechanics are covered in [Moderation](/docs/moderation).",
      },
    ],
  },

  /* ---------------------------------------------------------- */
  "for-fans": {
    group: "Platform",
    title: "For Fans",
    description:
      "What you pay, what you keep access to, and what a subscription does not entitle you to.",
    blocks: [
      { type: "h2", text: "Paying" },
      {
        type: "ul",
        items: [
          "Prices are quoted in stablecoins, so what you approve is what you pay.",
          "No card details, billing address or identity document is collected.",
          "The gas fee is separate from the creator's price and goes to the network, not to APHRO.",
        ],
      },
      { type: "h2", text: "What access means" },
      {
        type: "ul",
        items: [
          "A subscription unlocks the tier's posts for as long as the period you paid for is active.",
          "A pay-per-view unlock is permanent for that post while it stays published.",
          "Access is tied to your wallet. Move wallets and you move your access with a migration step.",
        ],
      },
      { type: "h2", text: "Cancelling and refunds" },
      {
        type: "p",
        text: "Revoking your allowance stops the next renewal and keeps access until the current period ends. Because payments settle instantly to the creator, APHRO. cannot reverse a charge. Refunds are the creator's call and are sent as a new transfer.",
      },
      { type: "h2", text: "What you may not do" },
      {
        type: "p",
        text: "Unlocking content buys you a personal view, not a licence. Re-uploading, reselling or redistributing a creator's content, including screen recordings, breaks the terms and can be pursued by the creator directly.",
      },
      {
        type: "callout",
        variant: "note",
        title: "Screens can always be recorded",
        text: "Encryption stops interception in transit and at rest. It cannot stop someone photographing their own screen. Creators should price and publish with that in mind.",
      },
    ],
  },

  /* ---------------------------------------------------------- */
  encryption: {
    group: "Security",
    title: "Encryption",
    description:
      "How content keys are generated, wrapped per subscriber and revoked when access ends.",
    blocks: [
      {
        type: "p",
        text: "Every post gets its own symmetric content key. That key is generated and used on the creator's device; the platform stores only ciphertext and wrapped keys.",
      },
      { type: "h2", text: "Key hierarchy" },
      {
        type: "ul",
        items: [
          "**Content key:** one per post, encrypts the media itself.",
          "**Subscriber key pair:** derived from the fan's wallet; the public half receives wrapped content keys.",
          "**Wrapped key:** a content key encrypted to one subscriber's public key. One per subscriber, per post.",
        ],
      },
      {
        type: "p",
        text: "Because keys are wrapped per subscriber rather than shared, revoking one person's access does not require re-encrypting the post for everyone else.",
      },
      { type: "h2", text: "Direct messages" },
      {
        type: "p",
        text: "DMs are end-to-end encrypted between the two wallets involved. Attachments follow the same content-key model as posts.",
      },
      { type: "h2", text: "Revocation" },
      {
        type: "ol",
        items: [
          "The subscription lapses or the allowance is revoked.",
          "The access layer stops issuing new wrapped keys to that subscriber.",
          "Future posts are never wrapped for them; already-decrypted material obviously cannot be recalled.",
        ],
      },
      { type: "h2", text: "Threat model" },
      {
        type: "table",
        head: ["Threat", "Handled by"],
        rows: [
          ["Server breach", "Servers hold ciphertext only"],
          ["Storage provider snooping", "Media is encrypted before upload"],
          ["Network interception", "TLS in transit, plus payload encryption"],
          ["Platform insider access", "No plaintext and no key material to abuse"],
          ["Subscriber re-sharing", "Not preventable; the deterrent is legal, not technical"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Independent review pending",
        text: "The contracts and the key-handling layer are scheduled for third-party audit before mainnet. Treat everything on this page as the design, not as audited-and-shipped, until the report is published here.",
      },
    ],
  },

  /* ---------------------------------------------------------- */
  payments: {
    group: "Security",
    title: "Payments",
    description:
      "On-chain settlement, recurring allowances, and why nothing sits in a platform balance.",
    blocks: [
      {
        type: "p",
        text: "Payments are contract calls, not processor charges. A subscription is an allowance the fan grants and can revoke; a renewal is a draw against it.",
      },
      { type: "h2", text: "Settlement" },
      {
        type: "ul",
        items: [
          "One transaction charges the fan, applies the split and pays the creator.",
          "No rolling reserve, no chargeback window, no minimum withdrawal.",
          "Every payment is publicly verifiable by transaction hash.",
        ],
      },
      { type: "h2", text: "Payment lifecycle" },
      {
        type: "code",
        lang: "text",
        code: `subscribe(creator, tier)
  ├─ check allowance ≥ tier.price
  ├─ transfer tier.price  fan → payout rules
  ├─ mint access record   (creator, tier, expiresAt)
  └─ emit Subscribed(fan, creator, tier, expiresAt)

renew()      draws price again once expiresAt is reached
revoke()     sets allowance to 0; access runs to expiresAt`,
      },
      { type: "h2", text: "Supported assets" },
      {
        type: "ul",
        items: [
          "Stablecoins for all listed prices, so a creator's tier price does not move with the market.",
          "The network's native token for gas only.",
          "Any additional asset is opt-in per creator and converted at quote time.",
        ],
      },
      { type: "h2", text: "Failed and stuck payments" },
      {
        type: "p",
        text: "A reverted transaction charges nothing but the gas the network already consumed. If a renewal fails because the allowance ran dry, access simply expires at the end of the paid period and the subscription can be restarted at any time.",
      },
      {
        type: "callout",
        variant: "note",
        title: "Fees",
        text: "Protocol and network fees are itemised on the [Fees](/docs/fees) page.",
      },
    ],
  },

  /* ---------------------------------------------------------- */
  privacy: {
    group: "Security",
    title: "Privacy",
    description:
      "What is public on-chain, what stays private, and how to keep the two apart.",
    blocks: [
      {
        type: "p",
        text: "On-chain settlement buys verifiability at the cost of visibility: amounts, timing and addresses are permanently public. Understand that trade-off before you pay or publish.",
      },
      { type: "h2", text: "Public" },
      {
        type: "ul",
        items: [
          "Wallet addresses on both sides of a payment.",
          "Amounts, timestamps and the creator being paid.",
          "Creator profiles, tier names and prices.",
        ],
      },
      { type: "h2", text: "Private" },
      {
        type: "ul",
        items: [
          "The content itself, encrypted client-side and never stored in plaintext.",
          "Direct messages and their attachments.",
          "Your legal identity: no KYC is collected from fans.",
        ],
      },
      { type: "h2", text: "Staying unlinked" },
      {
        type: "ol",
        items: [
          "Use a wallet dedicated to APHRO., funded so that it does not trace back to an exchange account under your name.",
          "Keep that wallet out of unrelated apps, airdrops and NFT mints. One careless signature links it.",
          "Do not reuse a handle, avatar or bio you use elsewhere.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "On-chain history is permanent",
        text: "A payment cannot be deleted or hidden after the fact. Deciding which wallet pays is a decision you only get to make once.",
      },
    ],
  },

  /* ---------------------------------------------------------- */
  moderation: {
    group: "Trust & Safety",
    title: "Moderation",
    description:
      "Reporting, delisting, and the honest limits of moderation on encrypted content.",
    blocks: [
      {
        type: "p",
        text: "APHRO. cannot scan content it cannot read. Moderation therefore acts on reports and on the parts of the system that are public: profiles, previews and the front end's index.",
      },
      { type: "h2", text: "Reporting" },
      {
        type: "ol",
        items: [
          "Any signed-in user can report a profile or a post.",
          "Reports of non-consensual material or content involving minors are escalated immediately.",
          "A reporter with access can attach the decrypted evidence for review; without it, review is limited to public metadata.",
        ],
      },
      { type: "h2", text: "Enforcement" },
      {
        type: "ul",
        items: [
          "**Delisting:** the profile or post is removed from the APHRO. interface and search.",
          "**Key withholding:** the access layer stops issuing new keys, so new unlocks cannot decrypt it.",
          "**Referral:** illegal material is referred to the appropriate authorities.",
        ],
      },
      { type: "h2", text: "Limits" },
      {
        type: "ul",
        items: [
          "Settled payments cannot be reversed by APHRO.",
          "Ciphertext already replicated to decentralised storage cannot be guaranteed deleted.",
          "Anything a subscriber has already decrypted is out of reach of any platform control.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Stated plainly",
        text: "Self-custody and encryption remove the platform's ability to freeze funds or read content, which also removes some of the tools a custodial platform would use against abuse. Enforcement here is real but narrower, and pretending otherwise would be dishonest.",
      },
    ],
  },

  /* ---------------------------------------------------------- */
  fees: {
    group: "Reference",
    title: "Fees",
    description: "Protocol fee, network gas, and who pays what.",
    blocks: [
      {
        type: "table",
        head: ["Item", "Amount", "Paid by", "Goes to"],
        rows: [
          ["Protocol fee", "Flat % of each payment", "Deducted from the payment", "Protocol treasury"],
          ["Creator share", "Remainder after fee and splits", "n/a", "Creator's wallet"],
          ["Network gas", "Varies with congestion", "Transaction sender", "Network validators"],
          ["Payouts", "None", "n/a", "n/a"],
          ["Signup", "None", "n/a", "n/a"],
        ],
      },
      {
        type: "p",
        text: "The exact protocol fee percentage is set at launch and published here. Splits configured by the creator are applied to the post-fee amount.",
      },
      { type: "h2", text: "What there is no fee for" },
      {
        type: "ul",
        items: [
          "Creating a profile or a tier.",
          "Uploading, storing or serving content.",
          "Moving your earnings; they are already in your wallet.",
          "Cancelling a subscription.",
        ],
      },
      {
        type: "callout",
        variant: "note",
        title: "Placeholder figures",
        text: "Fee numbers are finalised at launch. This table will carry the exact values once they are locked.",
      },
    ],
  },

  /* ---------------------------------------------------------- */
  faq: {
    group: "Reference",
    title: "FAQ",
    description: "Short answers to the questions that come up most.",
    blocks: [
      { type: "h3", text: "Do I need to understand crypto to use this?" },
      {
        type: "p",
        text: "You need a wallet and a stablecoin balance. The flows themselves look like any subscription checkout. The difference is that you approve a transaction instead of entering a card number.",
      },
      { type: "h3", text: "Can APHRO. freeze my earnings?" },
      {
        type: "p",
        text: "No. Funds settle to your wallet and are never held by the platform. APHRO. can remove a profile from its interface; it cannot touch a balance it does not hold.",
      },
      { type: "h3", text: "What if I lose my wallet?" },
      {
        type: "p",
        text: "The account is gone with it. There is no password reset, because there is no password and no custodian. Back up your recovery phrase.",
      },
      { type: "h3", text: "Is my content really private?" },
      {
        type: "p",
        text: "It is encrypted before it leaves your device and the platform never holds a plaintext copy. It is not protected against a subscriber recording their own screen. See [Encryption](/docs/encryption).",
      },
      { type: "h3", text: "Can fans pay with a card?" },
      {
        type: "p",
        text: "Not at launch. Card-to-stablecoin on-ramps may be integrated later, and would apply the on-ramp provider's own identity checks to the fan.",
      },
      { type: "h3", text: "Which chain does this run on?" },
      {
        type: "p",
        text: "A low-fee EVM network, chosen so that a small tip is not eaten by gas. The specific network and contract addresses are published here at launch.",
      },
      { type: "h3", text: "When is launch?" },
      {
        type: "p",
        text: "No public date yet. [Pre-register](/) and you will hear first.",
      },
    ],
  },
};

/* Sidebar structure. Group order and page order here are the source of
   truth for the sidebar and for the prev/next footer links. */
export const DOCS_NAV = [
  { title: "Getting Started", pages: ["introduction", "quick-start"] },
  { title: "Platform", pages: ["how-it-works", "for-creators", "for-fans"] },
  { title: "Security", pages: ["encryption", "payments", "privacy"] },
  { title: "Trust & Safety", pages: ["moderation"] },
  { title: "Reference", pages: ["fees", "faq"] },
];

/* Flat reading order, derived from DOCS_NAV — drives prev/next. */
export const DOCS_ORDER = DOCS_NAV.flatMap((group) => group.pages);

export const DOCS_HOME = DOCS_ORDER[0];

/* Heading text -> anchor id. Used by both the content renderer and the
   TOC so the two always agree. */
export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/* Every h2/h3 in a page, in document order. */
export function getPageHeadings(slug) {
  const page = DOCS_PAGES[slug];
  if (!page) return [];
  return page.blocks
    .filter((block) => block.type === "h2" || block.type === "h3")
    .map((block) => ({
      id: slugify(block.text),
      text: block.text,
      level: block.type === "h2" ? 2 : 3,
    }));
}

/* Plain text of a page, for the sidebar search index. */
function pageText(page) {
  return page.blocks
    .map((block) => {
      if (block.type === "ul" || block.type === "ol") return block.items.join(" ");
      if (block.type === "table") return [...block.head, ...block.rows.flat()].join(" ");
      if (block.type === "callout") return `${block.title} ${block.text}`;
      if (block.type === "code") return block.code;
      return block.text ?? "";
    })
    .join(" ");
}

/* Built once at module load — the docs set is small enough that a plain
   substring scan beats pulling in a search dependency. */
export const DOCS_SEARCH_INDEX = DOCS_ORDER.map((slug) => {
  const page = DOCS_PAGES[slug];
  return {
    slug,
    title: page.title,
    group: page.group,
    description: page.description,
    haystack: `${page.title} ${page.group} ${page.description} ${pageText(page)}`
      // Strip inline markdown so a search for "keys" is not blocked by backticks.
      .replace(/[`*[\]()#]/g, " ")
      .toLowerCase(),
  };
});

export function searchDocs(query) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return DOCS_SEARCH_INDEX.filter((entry) =>
    terms.every((term) => entry.haystack.includes(term)),
  );
}
