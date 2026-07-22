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
import { buildElementStyle, DEFAULT_ORDER, getByPath, getElementOverride } from "../../lib/siteContent";
import { Counter, Reveal } from "./motion";

const icons = [Building2, Target, Gem];
const statIcons = [Home, Handshake, Clock3, ShieldCheck];

const blockTags = new Set(["p", "h1", "h2", "h3", "h4", "div"]);

function EditableFrame({ path, content, editable, selectedPath, onSelect, onMove, onResize, children, block = false }) {
  const selected = editable && selectedPath === path;

  if (!editable) return children;

  const startInteraction = (event, mode) => {
    event.preventDefault();
    event.stopPropagation();

    const frame = event.currentTarget.closest("[data-cms-frame]");
    const rect = frame?.getBoundingClientRect();
    const override = getElementOverride(content, path);
    const startX = event.clientX;
    const startY = event.clientY;
    const start = {
      x: Number(override.x) || 0,
      y: Number(override.y) || 0,
      w: Number(override.w) || Math.round(rect?.width || 160),
      h: Number(override.h) || Math.round(rect?.height || 44),
    };

    onSelect(path);

    const move = (moveEvent) => {
      const dx = Math.round(moveEvent.clientX - startX);
      const dy = Math.round(moveEvent.clientY - startY);

      if (mode === "move") {
        onMove(path, { x: start.x + dx, y: start.y + dy });
      } else {
        onResize(path, {
          w: Math.max(24, start.w + dx),
          h: Math.max(18, start.h + dy),
        });
      }
    };

    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", stop);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", stop);
  };

  const Wrapper = block ? "div" : "span";

  return (
    <Wrapper
      className={`cms-canvas-element${selected ? " is-selected" : ""}`}
      data-cms-frame={path}
      style={buildElementStyle(content, path, true)}
      onPointerDown={(event) => {
        event.stopPropagation();
        onSelect(path);
      }}
    >
      {children}
      {selected && (
        <>
          <span
            className="cms-element-handle cms-element-drag"
            aria-label="Drag element"
            role="button"
            tabIndex={0}
            onPointerDown={(event) => startInteraction(event, "move")}
            onMouseDown={(event) => startInteraction(event, "move")}
          />
          <span
            className="cms-element-handle cms-element-resize"
            aria-label="Resize element"
            role="button"
            tabIndex={0}
            onPointerDown={(event) => startInteraction(event, "resize")}
            onMouseDown={(event) => startInteraction(event, "resize")}
          />
        </>
      )}
    </Wrapper>
  );
}

function EditableText({
  path,
  content,
  editable,
  onChange,
  selectedPath = "",
  onSelect = () => {},
  onMove = () => {},
  onResize = () => {},
  as = "span",
  className = "",
}) {
  const Tag = as;
  const value = String(getByPath(content, path) ?? "");
  if (!editable) return <Tag className={className} style={buildElementStyle(content, path)}>{value}</Tag>;

  return (
    <EditableFrame
      path={path}
      content={content}
      editable={editable}
      selectedPath={selectedPath}
      onSelect={onSelect}
      onMove={onMove}
      onResize={onResize}
      block={blockTags.has(as)}
    >
      <Tag
        className={`${className} cms-editable-text`}
        contentEditable
        suppressContentEditableWarning
        data-cms-path={path}
        onBlur={(event) => onChange(path, event.currentTarget.textContent || "")}
      >
        {value}
      </Tag>
    </EditableFrame>
  );
}

function EditableImage({
  path,
  content,
  editable,
  selectedPath = "",
  onSelect = () => {},
  onMove = () => {},
  onResize = () => {},
  className = "",
  alt = "",
}) {
  const image = (
    <img
      src={String(getByPath(content, path) || "")}
      alt={alt}
      className={className}
      data-cms-path={path}
      style={!editable ? buildElementStyle(content, path) : undefined}
    />
  );

  if (!editable) return image;

  return (
    <EditableFrame
      path={path}
      content={content}
      editable={editable}
      selectedPath={selectedPath}
      onSelect={onSelect}
      onMove={onMove}
      onResize={onResize}
    >
      {image}
    </EditableFrame>
  );
}

export default function LandingSections({
  content,
  editable = false,
  onChange = () => {},
  showCmsButton = true,
  showHeader = true,
  selectedPath = "",
  onSelect = () => {},
  onMove = () => {},
  onResize = () => {},
}) {
  const editorProps = { selectedPath, onSelect, onMove, onResize };
  return (
    <div className={`npb-site${editable ? " npb-site-editing" : ""}`}>
      {showCmsButton && (
        <a className="cms-open-button" href="/admin/site-builder">
          Open CMS Canvas
        </a>
      )}
      {showHeader && <Header content={content} editable={editable} onChange={onChange} {...editorProps} />}
      <main id="top">
        {DEFAULT_ORDER.map((section) => {
          const Component = sectionComponents[section];
          return Component ? <Component key={section} content={content} editable={editable} onChange={onChange} {...editorProps} /> : null;
        })}
      </main>
    </div>
  );
}

function Header({ content, editable, onChange, ...editorProps }) {
  return (
    <header className="npb-nav">
      <a href="#top" className="npb-wordmark" aria-label="Nirav Patel home">
        <EditableText path="nav.brandName" content={content} editable={editable} onChange={onChange} as="strong" {...editorProps} />
        <EditableText path="nav.brandRole" content={content} editable={editable} onChange={onChange} {...editorProps} />
      </a>
      <nav aria-label="Primary navigation">
        {content.nav.links.map((link, index) => (
          <a key={link.href} href={link.href}>
            <EditableText path={`nav.links.${index}.label`} content={content} editable={editable} onChange={onChange} {...editorProps} />
          </a>
        ))}
      </nav>
      <a href={`tel:+1${content.nav.phone.replace(/\D/g, "")}`} className="npb-nav-phone">
        <Phone size={17} />
        <EditableText path="nav.phone" content={content} editable={editable} onChange={onChange} {...editorProps} />
      </a>
    </header>
  );
}

function Hero({ content, editable, onChange, ...editorProps }) {
  return (
    <section className="npb-hero">
      <div className="npb-hero-bg">
        <EditableImage path="hero.backgroundImage" content={content} editable={editable} {...editorProps} />
      </div>
      <motion.div className="npb-giant-name" aria-hidden="true">
        <EditableText path="hero.watermark" content={content} editable={editable} onChange={onChange} {...editorProps} />
      </motion.div>
      <div className="npb-map-lines" aria-hidden="true" />

      <div className="npb-hero-copy">
        <motion.div className="npb-kicker" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Sparkles size={16} />
          <EditableText path="hero.kicker" content={content} editable={editable} onChange={onChange} {...editorProps} />
        </motion.div>
        <h1>
          {["line1", "line2", "line3"].map((line, index) => (
            <span key={line}>
              <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.82, delay: 0.08 + index * 0.1 }}>
                <EditableText path={`hero.${line}`} content={content} editable={editable} onChange={onChange} {...editorProps} />
              </motion.span>
            </span>
          ))}
        </h1>
        <EditableText path="hero.body" content={content} editable={editable} onChange={onChange} as="p" {...editorProps} />
        <div className="npb-hero-actions">
          <a href={content.contact.bookingUrl} className="npb-primary">
            <CalendarCheck size={18} />
            <EditableText path="hero.primaryCta" content={content} editable={editable} onChange={onChange} {...editorProps} />
            <ArrowRight size={18} />
          </a>
          <a href="#identity" className="npb-secondary">
            <EditableText path="hero.secondaryCta" content={content} editable={editable} onChange={onChange} {...editorProps} />
            <ChevronDown size={18} />
          </a>
        </div>
      </div>

      <motion.div className="npb-portrait-stage">
        <div className="npb-red-mark" aria-hidden="true" />
        <EditableImage path="hero.portraitImage" content={content} editable={editable} className="npb-hero-person" alt="Nirav Patel" {...editorProps} />
        <div className="npb-face-safe npb-credential-one">
          <Award size={17} />
          <EditableText path="hero.badge1" content={content} editable={editable} onChange={onChange} {...editorProps} />
        </div>
        <div className="npb-face-safe npb-credential-two">
          <Building2 size={17} />
          <EditableText path="hero.badge2" content={content} editable={editable} onChange={onChange} {...editorProps} />
        </div>
      </motion.div>

      <div className="npb-hero-proof">
        {["proof1", "proof2", "proof3"].map((key) => (
          <EditableText key={key} path={`hero.${key}`} content={content} editable={editable} onChange={onChange} {...editorProps} />
        ))}
      </div>
    </section>
  );
}

function BrandStrip({ content, editable, onChange, ...editorProps }) {
  return (
    <section className="npb-brand-strip">
      <div className="npb-strip-track" aria-hidden={!editable}>
        {Array.from({ length: 2 }).flatMap((_, set) =>
          content.brandStrip.items.map((_, index) => (
            <span key={`${set}-${index}`}>
              <EditableText path={`brandStrip.items.${index}`} content={content} editable={editable} onChange={onChange} {...editorProps} />
            </span>
          )),
        )}
      </div>
    </section>
  );
}

function Identity({ content, editable, onChange, ...editorProps }) {
  return (
    <section id="identity" className="npb-section npb-identity">
      <Reveal className="npb-section-head">
        <span className="npb-kicker">
          <EditableText path="identity.kicker" content={content} editable={editable} onChange={onChange} {...editorProps} />
        </span>
        <EditableText path="identity.title" content={content} editable={editable} onChange={onChange} as="h2" {...editorProps} />
        <EditableText path="identity.body" content={content} editable={editable} onChange={onChange} as="p" {...editorProps} />
      </Reveal>
      <div className="npb-principles">
        {content.identity.cards.map((_, index) => {
          const Icon = icons[index] || Gem;
          return (
            <Reveal key={index} delay={index * 0.1} className="npb-principle">
              <Icon size={28} />
              <EditableText path={`identity.cards.${index}.title`} content={content} editable={editable} onChange={onChange} as="h3" {...editorProps} />
              <EditableText path={`identity.cards.${index}.body`} content={content} editable={editable} onChange={onChange} as="p" {...editorProps} />
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function Proof({ content, editable, onChange, ...editorProps }) {
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
                  <EditableText path={`proof.stats.${index}.value`} content={content} editable={editable} onChange={onChange} {...editorProps} />
                  <EditableText path={`proof.stats.${index}.suffix`} content={content} editable={editable} onChange={onChange} {...editorProps} />
                </>
              ) : (
                <Counter value={Number(stat.value) || 0} suffix={stat.suffix} />
              )}
            </strong>
            <EditableText path={`proof.stats.${index}.label`} content={content} editable={editable} onChange={onChange} {...editorProps} />
          </Reveal>
        );
      })}
    </section>
  );
}

function Editorial({ content, editable, onChange, ...editorProps }) {
  return (
    <section className="npb-editorial">
      <Reveal className="npb-editorial-image">
        <EditableImage path="editorial.image" content={content} editable={editable} {...editorProps} />
      </Reveal>
      <Reveal delay={0.12} className="npb-editorial-copy">
        <span className="npb-kicker">
          <EditableText path="editorial.kicker" content={content} editable={editable} onChange={onChange} {...editorProps} />
        </span>
        <EditableText path="editorial.title" content={content} editable={editable} onChange={onChange} as="h2" {...editorProps} />
        <EditableText path="editorial.body" content={content} editable={editable} onChange={onChange} as="p" {...editorProps} />
        <ul>
          {content.editorial.bullets.map((_, index) => (
            <li key={index}>
              <CheckCircle2 size={18} />
              <EditableText path={`editorial.bullets.${index}`} content={content} editable={editable} onChange={onChange} {...editorProps} />
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

function Gallery({ content, editable, onChange, ...editorProps }) {
  return (
    <section className="npb-gallery-section">
      <Reveal className="npb-section-head">
        <span className="npb-kicker">
          <EditableText path="gallery.kicker" content={content} editable={editable} onChange={onChange} {...editorProps} />
        </span>
        <EditableText path="gallery.title" content={content} editable={editable} onChange={onChange} as="h2" {...editorProps} />
        <EditableText path="gallery.body" content={content} editable={editable} onChange={onChange} as="p" {...editorProps} />
      </Reveal>
      <div className="npb-gallery">
        {content.gallery.images.map((src, index) => (
          <motion.figure key={index} className="npb-gallery-card" whileHover={{ y: -10, rotate: index % 2 === 0 ? -1.2 : 1.2 }}>
            <EditableImage
              path={`gallery.images.${index}`}
              content={content}
              editable={editable}
              alt={`Nirav Patel client moment ${index + 1}`}
              {...editorProps}
            />
            <figcaption>
              <KeyRound size={15} />
              <EditableText path="gallery.caption" content={content} editable={editable} onChange={onChange} {...editorProps} />
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

function Method({ content, editable, onChange, ...editorProps }) {
  return (
    <section id="method" className="npb-method">
      <Reveal className="npb-method-head">
        <span className="npb-kicker">
          <EditableText path="method.kicker" content={content} editable={editable} onChange={onChange} {...editorProps} />
        </span>
        <EditableText path="method.title" content={content} editable={editable} onChange={onChange} as="h2" {...editorProps} />
      </Reveal>
      <div className="npb-method-list">
        {content.method.steps.map((_, index) => (
          <Reveal key={index} delay={index * 0.07} className="npb-method-step">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <EditableText path={`method.steps.${index}`} content={content} editable={editable} onChange={onChange} as="h3" {...editorProps} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Contact({ content, editable, onChange, ...editorProps }) {
  return (
    <section id="contact" className="npb-contact">
      <div className="npb-contact-image">
        <EditableImage path="contact.image" content={content} editable={editable} alt="Nirav Patel" {...editorProps} />
      </div>
      <Reveal className="npb-contact-copy">
        <span className="npb-kicker">
          <EditableText path="contact.kicker" content={content} editable={editable} onChange={onChange} {...editorProps} />
        </span>
        <EditableText path="contact.title" content={content} editable={editable} onChange={onChange} as="h2" {...editorProps} />
        <EditableText path="contact.body" content={content} editable={editable} onChange={onChange} as="p" {...editorProps} />
        <div className="npb-contact-actions">
          <a href={content.contact.bookingUrl} className="npb-primary npb-light-btn">
            <CalendarCheck size={18} />
            <EditableText path="contact.primaryCta" content={content} editable={editable} onChange={onChange} {...editorProps} />
            <ArrowRight size={18} />
          </a>
          <a href={`tel:+1${content.contact.phone.replace(/\D/g, "")}`} className="npb-phone-link">
            <Phone size={18} />
            <EditableText path="contact.phone" content={content} editable={editable} onChange={onChange} {...editorProps} />
          </a>
        </div>
      </Reveal>
    </section>
  );
}

function Footer({ content, editable, onChange, ...editorProps }) {
  return (
    <footer className="npb-footer">
      <div>
        <EditableText path="footer.name" content={content} editable={editable} onChange={onChange} as="strong" {...editorProps} />
        <EditableText path="footer.line" content={content} editable={editable} onChange={onChange} {...editorProps} />
      </div>
      <a href={`mailto:${content.footer.email}`}>
        <Mail size={18} />
        <EditableText path="footer.email" content={content} editable={editable} onChange={onChange} {...editorProps} />
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
