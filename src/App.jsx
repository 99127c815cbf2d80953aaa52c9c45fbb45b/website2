import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Intro from "./components/Intro";
import Navbar from "./components/Navbar";
import AboutSection from "./components/AboutSection";
import PreRegisterPanel from "./components/PreRegisterPanel";
import DocsLayout from "./components/docs/DocsLayout";
import useRoute from "./hooks/useRoute";
import "./App.css";

export default function App() {
  const { path, anchor } = useRoute();
  const isDocs = path === "/docs" || path.startsWith("/docs/");

  // Intro plays on initial mount only; once dismissed it never returns.
  // Landing on /docs directly skips it — nobody wants a splash before docs.
  const [introDone, setIntroDone] = useState(isDocs);

  const handleIntroComplete = useCallback(() => setIntroDone(true), []);

  if (isDocs) return <DocsLayout path={path} anchor={anchor} />;

  return (
    <>
      <AnimatePresence>
        {!introDone && <Intro key="intro" onComplete={handleIntroComplete} />}
      </AnimatePresence>

      {/* Main screen stays mounted beneath the intro, so nothing reflows when
          the intro unmounts — it's purely a cross-fade. */}
      <motion.div
        className="app"
        initial={{ opacity: 0 }}
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Navbar />
        <main className="app__split">
          <AboutSection />
          <PreRegisterPanel />
        </main>
      </motion.div>
    </>
  );
}
