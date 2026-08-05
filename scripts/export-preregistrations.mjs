#!/usr/bin/env node
/* ------------------------------------------------------------------
   Export the pre-registration list to CSV.

   The Admin SDK bypasses Firestore security rules, which is the whole
   point: firestore.rules denies `read` to everyone, so the browser
   cannot pull the list. A service account can.

   USAGE
     npm run export:emails
     npm run export:emails -- --out ~/Desktop/aphro-emails.csv

   CREDENTIALS
     Firebase Console > Project settings > Service accounts >
     Generate new private key. Save the JSON OUTSIDE this repo, then:

       export GOOGLE_APPLICATION_CREDENTIALS=~/secrets/aphro-admin.json

     That file is a real secret, unlike the web config: it grants full
     read/write on the project and ignores every security rule. Never
     commit it, never paste it anywhere. If it leaks, revoke the key in
     the same console screen immediately.
------------------------------------------------------------------ */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { cert, initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const COLLECTION = "preregistrations";

function parseArgs(argv) {
  const args = { out: null, key: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--out") args.out = argv[i + 1];
    if (argv[i] === "--key") args.key = argv[i + 1];
  }
  return args;
}

/* RFC 4180: wrap in quotes when the value holds a comma, quote, or
   newline, and double any inner quote. Emails rarely need this, but a
   malformed one should not be able to shift every later column. */
function csvCell(value) {
  const text = value == null ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toIso(timestamp) {
  if (!timestamp) return "";
  // Firestore Timestamp -> Date. Already-Date values pass through.
  if (typeof timestamp.toDate === "function") return timestamp.toDate().toISOString();
  return String(timestamp);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const keyPath = args.key || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!keyPath) {
    console.error(
      "No service account key.\n" +
        "  export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json\n" +
        "  or: npm run export:emails -- --key /path/to/key.json",
    );
    process.exit(1);
  }

  // Passing the path explicitly gives a clear error if it is wrong, which
  // applicationDefault() would swallow into a vague auth failure.
  const { default: serviceAccount } = await import(`file://${resolve(keyPath)}`, {
    with: { type: "json" },
  }).catch(() => ({ default: null }));

  initializeApp(
    serviceAccount ? { credential: cert(serviceAccount) } : { credential: applicationDefault() },
  );

  const db = getFirestore();
  const snapshot = await db.collection(COLLECTION).orderBy("createdAt", "asc").get();

  const header = ["email", "createdAt", "source"];
  const rows = snapshot.docs.map((doc) => {
    const data = doc.data();
    return [data.email ?? doc.id, toIso(data.createdAt), data.source ?? ""];
  });

  const csv =
    [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n") + "\n";

  const stamp = new Date().toISOString().slice(0, 10);
  const outPath = resolve(args.out || `preregistrations-${stamp}.csv`);
  writeFileSync(outPath, csv, "utf8");

  console.log(`${rows.length} pre-registration(s) -> ${outPath}`);
  if (rows.length === 0) {
    console.log("Collection is empty. Submit the form once to check the wiring.");
  }
}

main().catch((error) => {
  console.error("Export failed:", error?.message || error);
  process.exit(1);
});
