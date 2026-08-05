/* ------------------------------------------------------------------
   PRE-REGISTER STORAGE — writes one document per email to Firestore.

   Firebase is loaded with a dynamic import inside the submit handler,
   not at module scope. The SDK is ~90 KB gzipped and almost nobody who
   opens the landing page submits the form, so paying that cost upfront
   would slow the first paint for everyone.

   SECURITY, PLAINLY
   -----------------
   The Firebase web config below is public. It ships inside the JS
   bundle and anyone can read it — that is by design, it identifies the
   project, it does not authorise anything. The actual protection is the
   Firestore security rules (see firestore.rules): they allow `create`
   on this one collection and nothing else, no read, no update, no
   delete. Do not treat the env vars as a secret.

   DUPLICATES
   ----------
   The document ID is the normalised email, so signing up twice hits the
   same document. Rules forbid overwriting, so the second attempt fails
   with `permission-denied`. That is the expected path for "already on
   the list", which is why it resolves as a success below.
------------------------------------------------------------------ */

const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const COLLECTION = "preregistrations";

/* Lower-cased and trimmed, so "A@B.com " and "a@b.com" are one signup. */
export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export function isFirebaseConfigured() {
  return Boolean(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId);
}

export async function savePreRegistration(rawEmail) {
  const email = normalizeEmail(rawEmail);

  if (!isFirebaseConfigured()) {
    // In production a missing config means the build did not receive the
    // env secrets, and every signup is being dropped. Fail loudly: showing
    // the visitor a success screen while binning their email is worse than
    // showing an error.
    if (import.meta.env.PROD) {
      throw new Error("Firebase config missing from the build (VITE_FIREBASE_* env vars).");
    }
    // Local dev without a .env.local, so the form still works end to end.
    console.warn("[APHRO.] Firebase not configured, pre-register not saved:", email);
    return { saved: false, reason: "not-configured" };
  }

  const [{ initializeApp, getApp, getApps }, firestore] = await Promise.all([
    import("firebase/app"),
    import("firebase/firestore"),
  ]);
  const { getFirestore, doc, setDoc, serverTimestamp } = firestore;

  // getApps() guards against re-initialising on a second submit.
  const app = getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG);
  const db = getFirestore(app);

  try {
    await setDoc(doc(db, COLLECTION, email), {
      email,
      source: "landing",
      createdAt: serverTimestamp(),
    });
    return { saved: true };
  } catch (error) {
    // Rules reject a write to an existing document, which means this email
    // is already on the list. Nothing went wrong from the visitor's side.
    if (error?.code === "permission-denied") {
      // Logged because this branch also catches a genuinely broken rules
      // deploy, which would otherwise look like a stream of happy duplicates.
      console.info("[APHRO.] pre-register rejected by rules (already listed?):", email);
      return { saved: true, duplicate: true };
    }
    throw error;
  }
}
