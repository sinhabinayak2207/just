import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, useScroll, useSpring } from "framer-motion";
import SiteBuilderEditor from "./components/admin/SiteBuilderEditor";
import LandingSections from "./components/landing/LandingSections";
import { loadContent } from "./lib/siteContent";
import "./styles.css";

function PublicSite({ preview = false }) {
  const [content, setContent] = useState(() => loadContent());
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  useEffect(() => {
    document.title = preview ? "Preview - Nirav Patel CMS" : "Nirav Patel - Realtor With Builder Eyes";
    const sync = () => setContent(loadContent());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [preview]);

  return (
    <>
      <motion.div className="npb-progress" style={{ scaleX: progress }} />
      <LandingSections content={content} showCmsButton={!preview} />
    </>
  );
}

function Router() {
  const path = window.location.pathname;

  if (path.startsWith("/admin/site-builder")) {
    return <SiteBuilderEditor />;
  }

  if (path.startsWith("/preview")) {
    return <PublicSite preview />;
  }

  return <PublicSite />;
}

createRoot(document.getElementById("root")).render(<Router />);
