import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { animate, motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  Award,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Gem,
  Handshake,
  Home,
  KeyRound,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import "./styles.css";

const media = (file) => `https://niravpatel.ca/_assets/media/${file}`;

const assets = {
  hero: media("def10c275a38472b55e20fa60a3998ac.png"),
  builderWalk: media("5f4a3490025f0d195f2d5f1a4c9f2720.jpg"),
  cafe: media("63f978b9e160aeec9ae0dcbdccde6321.jpg"),
  clientMoments: [
    media("715b5063bc5e9630d6cb5aa05455cb0d.jpg"),
    media("6aecd3086e0ef586bb51531f6e096647.jpg"),
    media("d1d490c5493e75a2b4cd94662c5775e4.png"),
    media("f0aa897efae3f43649348c2fcc1490b8.png"),
    media("eebfc111540b5e769298d11b491055e5.jpg"),
    media("8d1fa091d63738beecc2909c34a0b0d0.jpg"),
    media("f77d0b90966b45fb9e50bdb973956496.jpg"),
    media("83521480f1608091fbca3707c9ef3d15.jpg"),
  ],
};

const nav = [
  ["Identity", "#identity"],
  ["Proof", "#proof"],
  ["Method", "#method"],
  ["Contact", "#contact"],
];

const proof = [
  { value: 120, suffix: "+", label: "Homes sold", icon: Home },
  { value: 436, suffix: "", label: "Offers negotiated", icon: Handshake },
  { value: 6, suffix: "+", label: "Years in real estate", icon: Clock3 },
  { value: 100, suffix: "%", label: "Client-first posture", icon: ShieldCheck },
];

const principles = [
  {
    title: "Builder eyes",
    text: "Tarion builder experience changes how a home is read: structure, finish, risk, and the questions hidden behind fresh paint.",
    icon: Building2,
  },
  {
    title: "Negotiator pulse",
    text: "Every deal gets a leverage map: price, timing, clauses, seller pressure, inspection risk, and closing control.",
    icon: Target,
  },
  {
    title: "Calm execution",
    text: "Clients get clear next steps instead of panic. The process stays human, direct, and clean from first call to keys.",
    icon: Gem,
  },
];

const method = [
  "Read the property beyond the listing",
  "Map risk, timing, and pressure",
  "Build the offer or launch strategy",
  "Negotiate without emotional noise",
  "Close with clean details",
];

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Counter({ value, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setCount,
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref}>
      {Math.round(count).toLocaleString()}
      {suffix}
    </span>
  );
}

function App() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const portraitY = useTransform(heroProgress, [0, 1], [0, 110]);
  const nameY = useTransform(heroProgress, [0, 1], [0, -85]);

  return (
    <div className="npb-site">
      <motion.div className="npb-progress" style={{ scaleX: progress }} />

      <header className="npb-nav">
        <a href="#top" className="npb-wordmark" aria-label="Nirav Patel home">
          <strong>Nirav Patel</strong>
          <span>Realtor</span>
        </a>
        <nav aria-label="Primary navigation">
          {nav.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a href="tel:+14165050521" className="npb-nav-phone">
          <Phone size={17} />
          416-505-0521
        </a>
      </header>

      <main id="top">
        <section ref={heroRef} className="npb-hero">
          <div className="npb-hero-bg">
            <img src={assets.clientMoments[0]} alt="" />
          </div>
          <motion.div className="npb-giant-name" style={{ y: nameY }} aria-hidden="true">
            Nirav
          </motion.div>
          <div className="npb-map-lines" aria-hidden="true" />

          <div className="npb-hero-copy">
            <motion.div
              className="npb-kicker"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles size={16} />
              Personal brand / Ontario real estate
            </motion.div>

            <h1>
              {["Nirav Patel", "sees what", "others miss."].map((line, index) => (
                <span key={line}>
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1], delay: 0.08 + index * 0.1 }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.68, delay: 0.45 }}
            >
              A realtor with builder-level eyes, negotiation discipline, and the calm to help
              families make expensive decisions without second-guessing every move.
            </motion.p>

            <motion.div
              className="npb-hero-actions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.68, delay: 0.58 }}
            >
              <a href="https://calendly.com/nirav-realtor/30min" className="npb-primary">
                <CalendarCheck size={18} />
                Book Nirav
                <ArrowRight size={18} />
              </a>
              <a href="#identity" className="npb-secondary">
                His edge
                <ChevronDown size={18} />
              </a>
            </motion.div>
          </div>

          <motion.div className="npb-portrait-stage" style={{ y: portraitY }}>
            <div className="npb-red-mark" aria-hidden="true" />
            <img src={assets.hero} alt="Nirav Patel" className="npb-hero-person" />
            <div className="npb-face-safe npb-credential-one">
              <Award size={17} />
              Certified negotiation expert
            </div>
            <div className="npb-face-safe npb-credential-two">
              <Building2 size={17} />
              Tarion builder insight
            </div>
          </motion.div>

          <div className="npb-hero-proof" aria-label="Nirav Patel quick proof">
            <span>120+ homes sold</span>
            <span>436 offers negotiated</span>
            <span>KWC to Durham</span>
          </div>
        </section>

        <section className="npb-brand-strip">
          <div className="npb-strip-track" aria-hidden="true">
            {Array.from({ length: 2 }).flatMap((_, set) =>
              ["Honest advice", "Builder eyes", "Sharp offers", "Calm closings", "Client first"].map(
                (item) => <span key={`${set}-${item}`}>{item}</span>,
              ),
            )}
          </div>
        </section>

        <section id="identity" className="npb-section npb-identity">
          <Reveal className="npb-section-head">
            <span className="npb-kicker">The identity</span>
            <h2>The personal brand is not luxury. It is trust with teeth.</h2>
            <p>
              Nirav should not look like another realtor with a suit and a slogan. The brand should
              feel specific: builder knowledge, direct advice, negotiation pressure, and real client
              wins.
            </p>
          </Reveal>

          <div className="npb-principles">
            {principles.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.1} className="npb-principle">
                <item.icon size={28} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="proof" className="npb-proof">
          {proof.map((item, index) => (
            <Reveal key={item.label} delay={index * 0.08} className="npb-proof-card">
              <item.icon size={24} />
              <strong>
                <Counter value={item.value} suffix={item.suffix} />
              </strong>
              <span>{item.label}</span>
            </Reveal>
          ))}
        </section>

        <section className="npb-editorial">
          <Reveal className="npb-editorial-image">
            <img src={assets.builderWalk} alt="Nirav Patel walking with clients" />
          </Reveal>
          <Reveal delay={0.12} className="npb-editorial-copy">
            <span className="npb-kicker">Why him</span>
            <h2>He does not just open doors. He reads the house.</h2>
            <p>
              A first showing can hide thousands in risk. Nirav's edge is asking better questions
              before clients fall in love with the wrong property or leave money on the table.
            </p>
            <ul>
              <li><CheckCircle2 size={18} /> Surface finish versus real condition</li>
              <li><CheckCircle2 size={18} /> Price pressure before offer night</li>
              <li><CheckCircle2 size={18} /> Negotiation terms beyond just price</li>
            </ul>
          </Reveal>
        </section>

        <section className="npb-gallery-section">
          <Reveal className="npb-section-head">
            <span className="npb-kicker">Real moments</span>
            <h2>The brand proof is the families.</h2>
            <p>
              The site should feel personal because the results are personal: keys, families, trust,
              and the relief that comes when a complex move finally closes cleanly.
            </p>
          </Reveal>
          <div className="npb-gallery">
            {assets.clientMoments.map((src, index) => (
              <motion.figure
                key={src}
                className="npb-gallery-card"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.62, delay: (index % 4) * 0.06 }}
                whileHover={{ y: -10, rotate: index % 2 === 0 ? -1.2 : 1.2 }}
              >
                <img src={src} alt={`Nirav Patel client moment ${index + 1}`} />
                <figcaption><KeyRound size={15} /> Closed with Nirav</figcaption>
              </motion.figure>
            ))}
          </div>
        </section>

        <section id="method" className="npb-method">
          <Reveal className="npb-method-head">
            <span className="npb-kicker">The method</span>
            <h2>A calm process for high-stakes decisions.</h2>
          </Reveal>
          <div className="npb-method-list">
            {method.map((step, index) => (
              <Reveal key={step} delay={index * 0.07} className="npb-method-step">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step}</h3>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="contact" className="npb-contact">
          <div className="npb-contact-image">
            <img src={assets.cafe} alt="Nirav Patel" />
          </div>
          <Reveal className="npb-contact-copy">
            <span className="npb-kicker">Talk to Nirav</span>
            <h2>Bring the goal. Leave with the next move.</h2>
            <p>
              Buying, selling, or investing across the GTA, KWC, or Durham? Start with a direct call
              and a practical read on your situation.
            </p>
            <div className="npb-contact-actions">
              <a href="https://calendly.com/nirav-realtor/30min" className="npb-primary npb-light-btn">
                <CalendarCheck size={18} />
                Book a call
                <ArrowRight size={18} />
              </a>
              <a href="tel:+14165050521" className="npb-phone-link">
                <Phone size={18} />
                416-505-0521
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="npb-footer">
        <div>
          <strong>Nirav Patel</strong>
          <span>Realtor / Brampton, Ontario</span>
        </div>
        <a href="mailto:info@niravpatel.ca">
          <Mail size={18} />
          info@niravpatel.ca
        </a>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
