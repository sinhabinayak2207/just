import { motion } from "framer-motion";
import React from "react";
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
import { DEFAULT_ORDER, getByPath } from "../../lib/siteContent";
import { Counter, Reveal } from "./motion";

const icons = [Building2, Target, Gem];
const statIcons = [Home, Handshake, Clock3, ShieldCheck];

function EditableText({ path, content, editable, onChange, as = "span", className = "" }) {
  const Tag = as;
  const value = String(getByPath(content, path) ?? "");
  if (!editable) return <Tag className={className}>{value}</Tag>;

  return (
    <Tag
      className={`${className} cms-editable-text`}
      contentEditable
      suppressContentEditableWarning
      data-cms-path={path}
      onBlur={(event) => onChange(path, event.currentTarget.textContent || "")}
    >
      {value}
    </Tag>
  );
}

function EditableImage({ path, content, className = "", alt = "" }) {
  return <img src={String(getByPath(content, path) || "")} alt={alt} className={className} data-cms-path={path} />;
}

export default function LandingSections({ content, editable = false, onChange = () => {}, showCmsButton = true }) {
  return (
    <div className="npb-site">
      {showCmsButton && (
        <a className="cms-open-button" href="/admin/site-builder">
          Open CMS Canvas
        </a>
      )}
      <Header content={content} editable={editable} onChange={onChange} />
      <main id="top">
        {DEFAULT_ORDER.map((section) => {
          const Component = sectionComponents[section];
          return Component ? <Component key={section} content={content} editable={editable} onChange={onChange} /> : null;
        })}
      </main>
    </div>
  );
}

function Header({ content, editable, onChange }) {
  return (
    <header className="npb-nav">
      <a href="#top" className="npb-wordmark" aria-label="Nirav Patel home">
        <EditableText path="nav.brandName" content={content} editable={editable} onChange={onChange} as="strong" />
        <EditableText path="nav.brandRole" content={content} editable={editable} onChange={onChange} />
      </a>
      <nav aria-label="Primary navigation">
        {content.nav.links.map((link, index) => (
          <a key={link.href} href={link.href}>
            <EditableText path={`nav.links.${index}.label`} content={content} editable={editable} onChange={onChange} />
          </a>
        ))}
      </nav>
      <a href={`tel:+1${content.nav.phone.replace(/\D/g, "")}`} className="npb-nav-phone">
        <Phone size={17} />
        <EditableText path="nav.phone" content={content} editable={editable} onChange={onChange} />
      </a>
    </header>
  );
}

function Hero({ content, editable, onChange }) {
  return (
    <section className="npb-hero">
      <div className="npb-hero-bg">
        <EditableImage path="hero.backgroundImage" content={content} />
      </div>
      <motion.div className="npb-giant-name" aria-hidden="true">
        <EditableText path="hero.watermark" content={content} editable={editable} onChange={onChange} />
      </motion.div>
      <div className="npb-map-lines" aria-hidden="true" />

      <div className="npb-hero-copy">
        <motion.div className="npb-kicker" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Sparkles size={16} />
          <EditableText path="hero.kicker" content={content} editable={editable} onChange={onChange} />
        </motion.div>
        <h1>
          {["line1", "line2", "line3"].map((line, index) => (
            <span key={line}>
              <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.82, delay: 0.08 + index * 0.1 }}>
                <EditableText path={`hero.${line}`} content={content} editable={editable} onChange={onChange} />
              </motion.span>
            </span>
          ))}
        </h1>
        <EditableText path="hero.body" content={content} editable={editable} onChange={onChange} as="p" />
        <div className="npb-hero-actions">
          <a href={content.contact.bookingUrl} className="npb-primary">
            <CalendarCheck size={18} />
            <EditableText path="hero.primaryCta" content={content} editable={editable} onChange={onChange} />
            <ArrowRight size={18} />
          </a>
          <a href="#identity" className="npb-secondary">
            <EditableText path="hero.secondaryCta" content={content} editable={editable} onChange={onChange} />
            <ChevronDown size={18} />
          </a>
        </div>
      </div>

      <motion.div className="npb-portrait-stage">
        <div className="npb-red-mark" aria-hidden="true" />
        <EditableImage path="hero.portraitImage" content={content} className="npb-hero-person" alt="Nirav Patel" />
        <div className="npb-face-safe npb-credential-one">
          <Award size={17} />
          <EditableText path="hero.badge1" content={content} editable={editable} onChange={onChange} />
        </div>
        <div className="npb-face-safe npb-credential-two">
          <Building2 size={17} />
          <EditableText path="hero.badge2" content={content} editable={editable} onChange={onChange} />
        </div>
      </motion.div>

      <div className="npb-hero-proof">
        {["proof1", "proof2", "proof3"].map((key) => (
          <EditableText key={key} path={`hero.${key}`} content={content} editable={editable} onChange={onChange} />
        ))}
      </div>
    </section>
  );
}

function BrandStrip({ content, editable, onChange }) {
  return (
    <section className="npb-brand-strip">
      <div className="npb-strip-track" aria-hidden={!editable}>
        {Array.from({ length: 2 }).flatMap((_, set) =>
          content.brandStrip.items.map((_, index) => (
            <span key={`${set}-${index}`}>
              <EditableText path={`brandStrip.items.${index}`} content={content} editable={editable} onChange={onChange} />
            </span>
          )),
        )}
      </div>
    </section>
  );
}

function Identity({ content, editable, onChange }) {
  return (
    <section id="identity" className="npb-section npb-identity">
      <Reveal className="npb-section-head">
        <span className="npb-kicker">
          <EditableText path="identity.kicker" content={content} editable={editable} onChange={onChange} />
        </span>
        <EditableText path="identity.title" content={content} editable={editable} onChange={onChange} as="h2" />
        <EditableText path="identity.body" content={content} editable={editable} onChange={onChange} as="p" />
      </Reveal>
      <div className="npb-principles">
        {content.identity.cards.map((_, index) => {
          const Icon = icons[index] || Gem;
          return (
            <Reveal key={index} delay={index * 0.1} className="npb-principle">
              <Icon size={28} />
              <EditableText path={`identity.cards.${index}.title`} content={content} editable={editable} onChange={onChange} as="h3" />
              <EditableText path={`identity.cards.${index}.body`} content={content} editable={editable} onChange={onChange} as="p" />
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function Proof({ content, editable, onChange }) {
  return (
    <section id="proof" className="npb-proof">
      {content.proof.stats.map((stat, index) => {
        const Icon = statIcons[index] || StarIcon;
        return (
          <Reveal key={index} delay={index * 0.08} className="npb-proof-card">
            <Icon size={24} />
            <strong>
              {editable ? (
                <>
                  <EditableText path={`proof.stats.${index}.value`} content={content} editable={editable} onChange={onChange} />
                  <EditableText path={`proof.stats.${index}.suffix`} content={content} editable={editable} onChange={onChange} />
                </>
              ) : (
                <Counter value={Number(stat.value) || 0} suffix={stat.suffix} />
              )}
            </strong>
            <EditableText path={`proof.stats.${index}.label`} content={content} editable={editable} onChange={onChange} />
          </Reveal>
        );
      })}
    </section>
  );
}

function Editorial({ content, editable, onChange }) {
  return (
    <section className="npb-editorial">
      <Reveal className="npb-editorial-image">
        <EditableImage path="editorial.image" content={content} />
      </Reveal>
      <Reveal delay={0.12} className="npb-editorial-copy">
        <span className="npb-kicker">
          <EditableText path="editorial.kicker" content={content} editable={editable} onChange={onChange} />
        </span>
        <EditableText path="editorial.title" content={content} editable={editable} onChange={onChange} as="h2" />
        <EditableText path="editorial.body" content={content} editable={editable} onChange={onChange} as="p" />
        <ul>
          {content.editorial.bullets.map((_, index) => (
            <li key={index}>
              <CheckCircle2 size={18} />
              <EditableText path={`editorial.bullets.${index}`} content={content} editable={editable} onChange={onChange} />
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

function Gallery({ content, editable, onChange }) {
  return (
    <section className="npb-gallery-section">
      <Reveal className="npb-section-head">
        <span className="npb-kicker">
          <EditableText path="gallery.kicker" content={content} editable={editable} onChange={onChange} />
        </span>
        <EditableText path="gallery.title" content={content} editable={editable} onChange={onChange} as="h2" />
        <EditableText path="gallery.body" content={content} editable={editable} onChange={onChange} as="p" />
      </Reveal>
      <div className="npb-gallery">
        {content.gallery.images.map((src, index) => (
          <motion.figure key={index} className="npb-gallery-card" whileHover={{ y: -10, rotate: index % 2 === 0 ? -1.2 : 1.2 }}>
            <img src={src} alt={`Nirav Patel client moment ${index + 1}`} data-cms-path={`gallery.images.${index}`} />
            <figcaption>
              <KeyRound size={15} />
              <EditableText path="gallery.caption" content={content} editable={editable} onChange={onChange} />
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

function Method({ content, editable, onChange }) {
  return (
    <section id="method" className="npb-method">
      <Reveal className="npb-method-head">
        <span className="npb-kicker">
          <EditableText path="method.kicker" content={content} editable={editable} onChange={onChange} />
        </span>
        <EditableText path="method.title" content={content} editable={editable} onChange={onChange} as="h2" />
      </Reveal>
      <div className="npb-method-list">
        {content.method.steps.map((_, index) => (
          <Reveal key={index} delay={index * 0.07} className="npb-method-step">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <EditableText path={`method.steps.${index}`} content={content} editable={editable} onChange={onChange} as="h3" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Contact({ content, editable, onChange }) {
  return (
    <section id="contact" className="npb-contact">
      <div className="npb-contact-image">
        <EditableImage path="contact.image" content={content} alt="Nirav Patel" />
      </div>
      <Reveal className="npb-contact-copy">
        <span className="npb-kicker">
          <EditableText path="contact.kicker" content={content} editable={editable} onChange={onChange} />
        </span>
        <EditableText path="contact.title" content={content} editable={editable} onChange={onChange} as="h2" />
        <EditableText path="contact.body" content={content} editable={editable} onChange={onChange} as="p" />
        <div className="npb-contact-actions">
          <a href={content.contact.bookingUrl} className="npb-primary npb-light-btn">
            <CalendarCheck size={18} />
            <EditableText path="contact.primaryCta" content={content} editable={editable} onChange={onChange} />
            <ArrowRight size={18} />
          </a>
          <a href={`tel:+1${content.contact.phone.replace(/\D/g, "")}`} className="npb-phone-link">
            <Phone size={18} />
            <EditableText path="contact.phone" content={content} editable={editable} onChange={onChange} />
          </a>
        </div>
      </Reveal>
    </section>
  );
}

function Footer({ content, editable, onChange }) {
  return (
    <footer className="npb-footer">
      <div>
        <EditableText path="footer.name" content={content} editable={editable} onChange={onChange} as="strong" />
        <EditableText path="footer.line" content={content} editable={editable} onChange={onChange} />
      </div>
      <a href={`mailto:${content.footer.email}`}>
        <Mail size={18} />
        <EditableText path="footer.email" content={content} editable={editable} onChange={onChange} />
      </a>
    </footer>
  );
}

function StarIcon(props) {
  return <ShieldCheck {...props} />;
}

const sectionComponents = {
  hero: Hero,
  brandStrip: BrandStrip,
  identity: Identity,
  proof: Proof,
  editorial: Editorial,
  gallery: Gallery,
  method: Method,
  contact: Contact,
  footer: Footer,
};
