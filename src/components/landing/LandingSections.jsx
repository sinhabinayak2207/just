import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
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
  Image as ImageIcon,
  KeyRound,
  Mail,
  Move,
  Phone,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  Type as TypeIcon,
} from "lucide-react";
import {
  buildElementScopedCss,
  buildElementStyle,
  buildSectionBackground,
  buildSectionScopedCss,
  collectFontFamilies,
  elementCxcClass,
  FONT_WEIGHTS,
  getByPath,
  getCustomSection,
  getElementOverride,
  getFreeItems,
  getSectionOrder,
  getSectionOverride,
  GOOGLE_FONTS,
  googleFontsHref,
  isCustomSectionId,
  sectionCxcClass,
  sectionLabel,
  SHADOW_PRESETS,
} from "../../lib/siteContent";
import { Counter, Reveal } from "./motion";

const icons = [Building2, Target, Gem];
const statIcons = [Home, Handshake, Clock3, ShieldCheck];

const blockTags = new Set(["p", "h1", "h2", "h3", "h4", "div"]);

// Short human label for an element's move chip, derived from its path.
function elementLabel(path) {
  const parts = String(path).split(".");
  let last = parts[parts.length - 1];
  if (last === "value" && parts.length >= 2) last = "element";
  return last.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^\w/, (c) => c.toUpperCase());
}

// The full element style panel (a JSX port of Tenderbuddy's StylePanel):
// position + per-axis scale, typography (100+ Google Fonts, weight, size,
// line-height, letter-spacing, align, colour) and box (padding, radius, border,
// background, object-fit, shadow). Shared by the on-canvas popover AND the
// sidebar inspector so both edit exactly the same override, live.
export function ElementStyleControls({ override, onDesign, onReset, path }) {
  const num = (key) => (override[key] ?? "");
  const str = (key) => (override[key] ?? "");
  const setN = (key, value) => onDesign(path, { [key]: value === "" ? "" : Number(value) });
  const setS = (key, value) => onDesign(path, { [key]: value });
  return (
    <div className="cms-style-controls" onPointerDown={(e) => e.stopPropagation()}>
      <div className="cms-style-sec">Position &amp; size</div>
      <div className="cms-style-grid">
        <label><span>X</span><input type="number" value={num("x")} onChange={(e) => setN("x", e.target.value)} /></label>
        <label><span>Y</span><input type="number" value={num("y")} onChange={(e) => setN("y", e.target.value)} /></label>
        <label><span>W</span><input type="number" value={num("w")} onChange={(e) => setN("w", e.target.value)} /></label>
        <label><span>H</span><input type="number" value={num("h")} onChange={(e) => setN("h", e.target.value)} /></label>
        <label><span>Z</span><input type="number" value={num("zIndex")} onChange={(e) => setN("zIndex", e.target.value)} /></label>
        <label><span>Opacity</span><input type="number" min="0" max="1" step="0.05" value={num("opacity")} onChange={(e) => setN("opacity", e.target.value)} /></label>
      </div>

      <div className="cms-style-sec">Typography</div>
      <label className="cms-style-row"><span>Font family</span>
        <select value={str("fontFamily")} onChange={(e) => setS("fontFamily", e.target.value)}>
          <option value="">Default</option>
          {GOOGLE_FONTS.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </label>
      <div className="cms-style-grid">
        <label><span>Size</span><input type="number" value={num("fontSize")} onChange={(e) => setN("fontSize", e.target.value)} /></label>
        <label><span>Weight</span>
          <select value={str("fontWeight")} onChange={(e) => setS("fontWeight", e.target.value)}>
            <option value="">Auto</option>
            {FONT_WEIGHTS.map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
        </label>
        <label><span>Align</span>
          <select value={str("textAlign")} onChange={(e) => setS("textAlign", e.target.value)}>
            <option value="">Auto</option>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </label>
        <label><span>Line-h</span><input value={str("lineHeight")} placeholder="1.4" onChange={(e) => setS("lineHeight", e.target.value)} /></label>
        <label><span>Letter</span><input value={str("letterSpacing")} placeholder="0.02em" onChange={(e) => setS("letterSpacing", e.target.value)} /></label>
        <label className="cms-style-color"><span>Color</span><input type="color" value={override.color || "#ffffff"} onChange={(e) => setS("color", e.target.value)} /></label>
      </div>

      <div className="cms-style-sec">Box &amp; effects</div>
      <div className="cms-style-grid">
        <label><span>Pad</span><input type="number" value={num("padding")} onChange={(e) => setN("padding", e.target.value)} /></label>
        <label><span>Radius</span><input type="number" value={num("radius")} onChange={(e) => setN("radius", e.target.value)} /></label>
        <label><span>Border w</span><input type="number" value={num("borderWidth")} onChange={(e) => setN("borderWidth", e.target.value)} /></label>
        <label className="cms-style-color"><span>Border</span><input type="color" value={override.borderColor || "#ffffff"} onChange={(e) => setS("borderColor", e.target.value)} /></label>
        <label className="cms-style-color"><span>BG</span><input type="color" value={override.background || "#111111"} onChange={(e) => setS("background", e.target.value)} /></label>
        <label><span>Fit</span>
          <select value={str("objectFit")} onChange={(e) => setS("objectFit", e.target.value)}>
            <option value="">auto</option>
            <option value="cover">cover</option>
            <option value="contain">contain</option>
            <option value="fill">fill</option>
          </select>
        </label>
        <label className="cms-style-wide"><span>Shadow</span>
          <select value={override.shadow || "none"} onChange={(e) => setS("shadow", e.target.value)}>
            {Object.keys(SHADOW_PRESETS).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>

      <div className="cms-style-actions">
        <button type="button" onClick={() => onDesign(path, { color: "", background: "" })}>Clear colours</button>
        <button type="button" onClick={() => onReset(path)}>Reset element</button>
      </div>
    </div>
  );
}

// The on-canvas floating version — the same controls, in a scrollable card.
function ElementStylePopover({ override, onDesign, onReset, path }) {
  return (
    <div className="cms-el-pop" onPointerDown={(e) => e.stopPropagation()}>
      <div className="cms-el-pop-head">Style</div>
      <ElementStyleControls override={override} onDesign={onDesign} onReset={onReset} path={path} />
    </div>
  );
}

// Framer-like editing wrapper: a thin NON-blocking selection ring, a small
// floating move chip + resize handle, and a compact colour/style toolbar. The
// content stays fully clickable so inline text editing is never blocked.
function EditableFrame({
  path,
  content,
  editable,
  selectedPath,
  onSelect = () => {},
  onMove = () => {},
  onResize = () => {},
  onDesign = () => {},
  onReset = () => {},
  onDelete,
  children,
  block = false,
  label,
  frameClassName = "",
  keepPosition = false,
  scale = 1,
}) {
  const sc = scale || 1;
  const selected = editable && selectedPath === path;
  const ref = useRef(null);
  const drag = useRef(null);
  const [hover, setHover] = useState(false);
  const [live, setLive] = useState(null); // { x, y } | { sx, sy }
  const [panel, setPanel] = useState(false);

  if (!editable) return children;

  const override = getElementOverride(content, path);
  const show = hover || selected;
  const chipLabel = label || elementLabel(path);

  const style = buildElementStyle(content, path, true);
  // Only make it block-aware when a box override already set display (matches the
  // public StaticEl wrapper). Uncustomised elements keep natural flow so the canvas
  // wraps text exactly like the preview.
  if (style.display) style.display = override.display || (block ? "block" : "inline-block");
  // For elements whose own class already positions them (decorative shapes /
  // absolutely-placed layers), don't clobber that position — the transform move
  // still applies on top, and an absolutely positioned wrapper is still a valid
  // containing block for the chip/handle.
  if (keepPosition) delete style.position;
  // While dragging, mirror the live transform (move → translate, resize →
  // per-axis scale) over the persisted values so the element tracks the cursor.
  if (live) {
    if (live.x != null) {
      style.transform = `translate(${live.x}px, ${live.y}px)`;
      style.transformOrigin = "top left";
    } else {
      // Resize sets real width/height so text reflows on a wider box and the
      // selection chrome (chip / handles / toolbar) never scales with it.
      style.width = `${live.w}px`;
      style.height = `${live.h}px`;
    }
  }

  const round2 = (v) => Math.round(v * 100) / 100;
  const down = (event, mode) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect(path);
    const el = ref.current;
    drag.current = {
      mode,
      sx: event.clientX,
      sy: event.clientY,
      ox: Number(override.x) || 0,
      oy: Number(override.y) || 0,
      osx: Number(override.scaleX) || 1,
      osy: Number(override.scaleY) || 1,
      ew: Math.round(el?.offsetWidth || 160),
      eh: Math.round(el?.offsetHeight || 44),
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const move = (event) => {
    const d = drag.current;
    if (!d) return;
    const dx = (event.clientX - d.sx) / sc;
    const dy = (event.clientY - d.sy) / sc;
    if (d.mode === "move") setLive({ x: d.ox + dx, y: d.oy + dy });
    // Resize: horizontal drag → width (text reflows), vertical drag → height.
    else setLive({ w: Math.max(40, d.ew + dx), h: Math.max(24, d.eh + dy) });
  };
  const up = (event) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    const dx = (event.clientX - d.sx) / sc;
    const dy = (event.clientY - d.sy) / sc;
    if (d.mode === "move") onMove(path, { x: Math.round(d.ox + dx), y: Math.round(d.oy + dy) });
    else onResize(path, { w: Math.round(Math.max(40, d.ew + dx)), h: Math.round(Math.max(24, d.eh + dy)) });
    setLive(null);
  };

  const scopedCss = buildElementScopedCss(content, path);
  const cxc = scopedCss ? elementCxcClass(path) : undefined;
  const Wrapper = block ? "div" : "span";

  return (
    <Wrapper
      ref={ref}
      className={`cms-canvas-element${selected ? " is-selected" : ""}${frameClassName ? ` ${frameClassName}` : ""}`}
      data-cms-frame={path}
      style={style}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onPointerDown={(event) => {
        event.stopPropagation();
        onSelect(path);
      }}
    >
      {scopedCss && <style>{scopedCss}</style>}
      {/* data-cxc on a display:contents span so scoped colour/typography styles
          the CONTENT only, never the selection chrome (chip / toolbar / handles). */}
      {cxc ? <span data-cxc={cxc} style={{ display: "contents" }}>{children}</span> : children}

      {show && (
        <span className={`cms-el-ring${selected ? " is-selected" : ""}`} aria-hidden="true" />
      )}

      {show && (
        <span
          className="cms-el-chip"
          onPointerDown={(event) => down(event, "move")}
          onPointerMove={move}
          onPointerUp={up}
        >
          <Move size={11} strokeWidth={2.5} />
          {chipLabel}
        </span>
      )}

      {selected && (
        <span
          className="cms-el-resize"
          onPointerDown={(event) => down(event, "resize")}
          onPointerMove={move}
          onPointerUp={up}
        />
      )}

      {selected && (
        <div className="cms-el-toolbar" onPointerDown={(e) => e.stopPropagation()}>
          <button
            type="button"
            title="Size, spacing & position"
            className={panel ? "is-on" : ""}
            onClick={() => setPanel((v) => !v)}
          >
            Aa
          </button>
          <span className="cms-el-sep" />
          <label className="cms-el-swatch" title="Text colour">
            A
            <span className="cms-el-swatch-bar" style={{ background: override.color || "#ffffff" }} />
            <input type="color" value={override.color || "#ffffff"} onChange={(e) => onDesign(path, { color: e.target.value })} />
          </label>
          <label className="cms-el-swatch is-bg" title="Background colour" style={{ background: override.background || "transparent" }}>
            BG
            <input type="color" value={override.background || "#111111"} onChange={(e) => onDesign(path, { background: e.target.value })} />
          </label>
          <button type="button" title="Clear colours" onClick={() => onDesign(path, { color: "", background: "" })}>⌫</button>
          <span className="cms-el-sep" />
          <button
            type="button"
            className="cms-el-del"
            title={onDelete ? "Delete element" : "Hide element"}
            onClick={onDelete ? onDelete : () => onDesign(path, { hidden: true })}
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}

      {selected && panel && (
        <ElementStylePopover override={override} onDesign={onDesign} onReset={onReset} path={path} />
      )}
    </Wrapper>
  );
}

// Public-render mirror of EditableFrame's wrapper: applies the SAME box
// (buildElementStyle + block-aware display) + scoped CSS around the child, so the
// live site renders an edited element IDENTICALLY to how it looks on the canvas
// (WYSIWYG). Untouched elements render with no wrapper so layout is unchanged.
function StaticEl({ content, path, block, children }) {
  const override = getElementOverride(content, path);
  if (override.hidden) return null;
  const scoped = buildElementScopedCss(content, path);
  const style = buildElementStyle(content, path, false);
  if (!scoped && Object.keys(style).length === 0) return children;
  if (style.display) style.display = override.display || (block ? "block" : "inline-block");
  const cxc = scoped ? elementCxcClass(path) : undefined;
  const Wrapper = block ? "div" : "span";
  return (
    <>
      {scoped && <style>{scoped}</style>}
      <Wrapper data-cxc={cxc} style={style}>{children}</Wrapper>
    </>
  );
}

function EditableText({ path, content, editable, onChange = () => {}, as = "span", className = "", ...frame }) {
  const Tag = as;
  const value = String(getByPath(content, path) ?? "");
  if (getElementOverride(content, path).hidden) return null; // hidden on canvas + public
  if (!editable) {
    return (
      <StaticEl content={content} path={path} block={blockTags.has(as)}>
        <Tag className={className}>{value}</Tag>
      </StaticEl>
    );
  }

  return (
    <EditableFrame path={path} content={content} editable={editable} block={blockTags.has(as)} {...frame}>
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

function EditableImage({ path, content, editable, className = "", alt = "", block = false, ...frame }) {
  const override = getElementOverride(content, path);
  if (override.hidden) return null; // hidden cleanly (no broken-image box)
  const src = String(getByPath(content, path) || "");
  // When the element has a size override, the image fills its (wrapper) box so a
  // resize actually resizes the picture — identically on canvas + public.
  const fill = override.w || override.h ? { width: "100%", height: "100%", objectFit: override.objectFit || "cover" } : undefined;

  if (!editable) {
    if (!src) return null; // empty image → nothing on the public site (no broken box)
    return (
      <StaticEl content={content} path={path} block={block}>
        <img src={src} alt={alt} className={className} data-cms-path={path} style={fill} />
      </StaticEl>
    );
  }

  const inner = src ? (
    <img src={src} alt={alt} className={className} data-cms-path={path} style={fill} />
  ) : (
    <span className="cms-img-placeholder">＋ Add image — upload in the inspector</span>
  );

  return (
    <EditableFrame path={path} content={content} editable={editable} block={block} {...frame}>
      {inner}
    </EditableFrame>
  );
}

// Wrap ANY non-text visual (an icon, a step number, a pill, a badge) so it is
// selectable, movable, resizable, colour/style editable and hideable — the same
// override model as text/images, keyed by a stable `path`. Colour (text) recolours
// icons via `currentColor`; background paints a chip behind it. `path` needs no
// content value — overrides live in design.elements regardless.
function EditablePart({ path, content, editable, label, block = false, children, ...frame }) {
  if (getElementOverride(content, path).hidden) return null;
  if (!editable) {
    // Public: leave the markup untouched unless the part was actually customised,
    // so wrapping icons/numbers never shifts the live layout.
    const scoped = buildElementScopedCss(content, path);
    const style = buildElementStyle(content, path);
    if (!scoped && Object.keys(style).length === 0) return children;
    const cxc = scoped ? elementCxcClass(path) : undefined;
    const Tag = block ? "div" : "span";
    return (
      <>
        {scoped && <style>{scoped}</style>}
        <Tag className="npb-part" data-cxc={cxc} style={style}>
          {children}
        </Tag>
      </>
    );
  }
  return (
    <EditableFrame path={path} content={content} editable block={block} label={label} {...frame}>
      <span className="npb-part">{children}</span>
    </EditableFrame>
  );
}

// Wrap a purely-decorative CSS shape (the red circle, map grid, glow blobs).
// The EditableFrame wrapper *carries the shape's own class* (so it keeps its
// look + position), while gaining select / move / scale / recolour / hide. The
// user's background override recolours the shape; hidden removes it entirely.
function EditableShape({ path, content, editable, className = "", label, ...frame }) {
  const override = getElementOverride(content, path);
  if (override.hidden) return null;
  if (!editable) {
    const style = buildElementStyle(content, path);
    if (override.background) style.background = override.background; // recolour the shape
    return <div className={className} data-cms-path={path} style={style} aria-hidden="true" />;
  }
  return (
    <EditableFrame
      path={path}
      content={content}
      editable
      block
      keepPosition
      frameClassName={`npb-shape ${className}`}
      label={label}
      {...frame}
    >
      {null}
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
  onDesign = () => {},
  onReset = () => {},
  onSelectSection = () => {},
  onSectionResize = () => {},
  onAddCanvasElement = () => {},
  onRemoveCanvasElement = () => {},
  onRemoveFreeItem = () => {},
  scale = 1,
}) {
  // `scale` is the factor by which the canvas is visually shrunk to fit beside the
  // sidebar (the site is rendered at full 100vw so vw-based fonts match the live
  // preview, then scaled down). Drag deltas are in on-screen px, so they must be
  // divided by `scale` to become real content-space px.
  const editorProps = { selectedPath, onSelect, onMove, onResize, onDesign, onReset, scale };
  // SectionFrame renders the per-section free-element overlay, so it needs the
  // element editor props + text change + remove handler too.
  const sectionApi = { editable, onSelectSection, onSectionResize, onChange, onRemoveFreeItem, ...editorProps };
  const order = getSectionOrder(content);
  const fontsHref = googleFontsHref(collectFontFamilies(content));

  return (
    <div className={`npb-site${editable ? " npb-site-editing" : ""}`}>
      {fontsHref && <link rel="stylesheet" href={fontsHref} />}
      {showCmsButton && (
        <a className="cms-open-button" href="/admin/site-builder">
          Open CMS Canvas
        </a>
      )}
      {showHeader && <Header content={content} editable={editable} onChange={onChange} {...editorProps} />}
      <main id="top">
        {order.map((section) => {
          const Component = sectionComponents[section];
          if (Component) {
            return (
              <SectionFrame key={section} sid={section} content={content} {...sectionApi}>
                <Component content={content} editable={editable} onChange={onChange} {...editorProps} />
              </SectionFrame>
            );
          }
          if (isCustomSectionId(section)) {
            return (
              <SectionFrame key={section} sid={section} content={content} {...sectionApi}>
                <CustomSection
                  sid={section}
                  content={content}
                  editable={editable}
                  onChange={onChange}
                  onAddCanvasElement={onAddCanvasElement}
                  onRemoveCanvasElement={onRemoveCanvasElement}
                  {...editorProps}
                />
              </SectionFrame>
            );
          }
          return null;
        })}
      </main>
    </div>
  );
}

// Wraps a section so it can carry a per-section background (colour / gradient /
// image + overlay), whole-section typography, a min-height + padding resize, and
// be selected on the canvas by clicking its empty area.
function SectionFrame({ sid, content, editable, selectedPath, onSelectSection, onSectionResize = () => {}, onChange, onRemoveFreeItem, children, ...editorProps }) {
  const [hover, setHover] = useState(false);
  const [liveH, setLiveH] = useState(null);
  const drag = useRef(null);
  const ref = useRef(null);
  const { hasBg, layerStyle, overlayStyle } = buildSectionBackground(content, sid);
  const selected = editable && selectedPath === `section:${sid}`;
  const scopedCss = buildSectionScopedCss(content, sid);
  const secCxc = scopedCss ? sectionCxcClass(sid) : undefined;
  const secO = getSectionOverride(content, sid);

  // Section box overrides (resize): min-height + vertical padding.
  const frameStyle = {};
  const minH = liveH != null ? liveH : Number(secO.minHeight) || 0;
  if (minH) frameStyle.minHeight = `${minH}px`;
  if (secO.padding != null && secO.padding !== "") {
    frameStyle.paddingTop = `${Number(secO.padding)}px`;
    frameStyle.paddingBottom = `${Number(secO.padding)}px`;
  }
  // Paint the solid colour on the frame itself too (the .has-bg rule makes the
  // section transparent), so a section bg colour is guaranteed to show even where
  // the section's own markup would otherwise cover the behind-content layer.
  if (secO.bg) frameStyle.background = secO.bg;

  const bg = hasBg ? (
    <>
      {Object.keys(layerStyle).length > 0 && <div className="npb-section-bg" style={layerStyle} aria-hidden="true" />}
      {overlayStyle && <div className="npb-section-overlay" style={overlayStyle} aria-hidden="true" />}
    </>
  ) : null;

  const freeLayer = (
    <FreeItemsLayer
      sid={sid}
      content={content}
      editable={editable}
      selectedPath={selectedPath}
      onChange={onChange}
      onRemoveFreeItem={onRemoveFreeItem}
      {...editorProps}
    />
  );

  if (!editable) {
    return (
      <div className={`npb-section-frame${hasBg ? " has-bg" : ""}`} data-section={sid} data-cxc-sec={secCxc} style={frameStyle}>
        {scopedCss && <style>{scopedCss}</style>}
        {bg}
        {children}
        {freeLayer}
      </div>
    );
  }

  const startResize = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onSelectSection(sid);
    drag.current = { sy: event.clientY, base: Number(secO.minHeight) || Math.round(ref.current?.offsetHeight || 400) };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const secScale = editorProps.scale || 1;
  const moveResize = (event) => {
    if (!drag.current) return;
    setLiveH(Math.max(120, drag.current.base + (event.clientY - drag.current.sy) / secScale));
  };
  const endResize = (event) => {
    if (!drag.current) return;
    const next = Math.max(120, drag.current.base + (event.clientY - drag.current.sy) / secScale);
    drag.current = null;
    setLiveH(null);
    onSectionResize(sid, { minHeight: Math.round(next) });
  };

  return (
    <div
      ref={ref}
      className={`npb-section-frame is-editing${hasBg ? " has-bg" : ""}${selected ? " is-selected" : ""}`}
      data-section={sid}
      data-cxc-sec={secCxc}
      style={frameStyle}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onPointerDown={() => onSelectSection(sid)}
    >
      {scopedCss && <style>{scopedCss}</style>}
      {bg}
      {children}
      {freeLayer}
      {(hover || selected) && (
        <button
          type="button"
          className="npb-section-chip"
          onPointerDown={(e) => {
            e.stopPropagation();
            onSelectSection(sid);
          }}
        >
          <Move size={11} strokeWidth={2.5} />
          {sectionLabel(sid)}
        </button>
      )}
      {(hover || selected) && <span className="npb-section-ring" aria-hidden="true" />}
      {(hover || selected) && (
        <span
          className="npb-section-resize"
          title="Drag to set section height"
          onPointerDown={startResize}
          onPointerMove={moveResize}
          onPointerUp={endResize}
        />
      )}
    </div>
  );
}

// Overlay layer rendered inside EVERY section frame. Holds the free TEXT / IMAGE
// elements a user added to that section via the canvas "Add element" control.
// Each is absolutely positioned and fully move / resize / colour / style editable
// like any other element (and renders identically on the public site).
function FreeItemsLayer({ sid, content, editable, selectedPath, onChange, onRemoveFreeItem, ...editorProps }) {
  const items = getFreeItems(content, sid);
  const entries = Object.entries(items);
  if (!entries.length) return null;

  return (
    <div className={`npb-free-layer${editable ? " is-editing" : ""}`}>
      {entries.map(([eid, item]) => {
        if (!item) return null;
        const path = `freeItems.${sid}.${eid}.value`;
        const label = item.type === "image" ? "Image" : "Text";
        const common = {
          path,
          content,
          editable,
          selectedPath,
          label,
          onDelete: () => onRemoveFreeItem(sid, eid),
          ...editorProps,
        };
        return (
          <div key={eid} className="npb-free-el">
            {item.type === "image" ? (
              <EditableImage {...common} block alt="" className="npb-free-img" />
            ) : (
              <EditableText {...common} onChange={onChange} as="div" className="npb-free-text" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// A blank positioned canvas: users add free TEXT / IMAGE elements, each fully
// move / resize / colour / style editable like every other element.
function CustomSection({ sid, content, editable, onChange, onAddCanvasElement, onRemoveCanvasElement, ...editorProps }) {
  const section = getCustomSection(content, sid);
  const base = `customSections.${sid}.items`;

  return (
    <section className="npb-custom-section" style={{ minHeight: `${section.height}px` }}>
      {editable && (
        <div className="npb-custom-toolbar" onPointerDown={(e) => e.stopPropagation()}>
          <span className="npb-custom-tag">Custom canvas</span>
          <button type="button" onClick={() => onAddCanvasElement(sid, "text")}>
            <TypeIcon size={13} /> Add text
          </button>
          <button type="button" onClick={() => onAddCanvasElement(sid, "image")}>
            <ImageIcon size={13} /> Add image
          </button>
        </div>
      )}
      <div className="npb-custom-canvas">
        {section.order.map((eid) => {
          const item = section.items[eid];
          if (!item) return null;
          const path = `${base}.${eid}.value`;
          return (
            <div key={eid} className="npb-custom-el">
              {item.type === "image" ? (
                <EditableImage path={path} content={content} editable={editable} block alt="" {...editorProps} />
              ) : (
                <EditableText path={path} content={content} editable={editable} onChange={onChange} as="div" {...editorProps} />
              )}
              {editable && (
                <button
                  type="button"
                  className="npb-custom-del"
                  title="Delete element"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => onRemoveCanvasElement(sid, eid)}
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          );
        })}
        {editable && section.order.length === 0 && (
          <p className="npb-custom-empty">Empty canvas — use “Add text” or “Add image” above, then drag elements into place.</p>
        )}
      </div>
    </section>
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
        <EditablePart path="nav.icon.phone" content={content} editable={editable} label="Icon" {...editorProps}>
          <Phone size={17} />
        </EditablePart>
        <EditableText path="nav.phone" content={content} editable={editable} onChange={onChange} {...editorProps} />
      </a>
    </header>
  );
}

function Hero({ content, editable, onChange, ...editorProps }) {
  const P = (path, label, node) => (
    <EditablePart path={path} content={content} editable={editable} label={label} {...editorProps}>
      {node}
    </EditablePart>
  );
  return (
    <section className="npb-hero">
      <div className="npb-hero-bg">
        <EditableImage path="hero.backgroundImage" content={content} editable={editable} {...editorProps} />
      </div>
      <motion.div className="npb-giant-name" aria-hidden="true">
        <EditableText path="hero.watermark" content={content} editable={editable} onChange={onChange} {...editorProps} />
      </motion.div>
      <EditableShape path="hero.mapLines" className="npb-map-lines" label="Map grid" content={content} editable={editable} {...editorProps} />

      <div className="npb-hero-copy">
        <motion.div className="npb-kicker" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {P("hero.icon.kicker", "Icon", <Sparkles size={16} />)}
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
            {P("hero.icon.ctaPrimary", "Icon", <CalendarCheck size={18} />)}
            <EditableText path="hero.primaryCta" content={content} editable={editable} onChange={onChange} {...editorProps} />
            {P("hero.icon.ctaArrow", "Icon", <ArrowRight size={18} />)}
          </a>
          <a href="#identity" className="npb-secondary">
            <EditableText path="hero.secondaryCta" content={content} editable={editable} onChange={onChange} {...editorProps} />
            {P("hero.icon.ctaChevron", "Icon", <ChevronDown size={18} />)}
          </a>
        </div>
      </div>

      <motion.div className="npb-portrait-stage">
        <EditableShape path="hero.redMark" className="npb-red-mark" label="Red circle" content={content} editable={editable} {...editorProps} />
        <EditableImage path="hero.portraitImage" content={content} editable={editable} className="npb-hero-person" alt="Nirav Patel" {...editorProps} />
        <div className="npb-face-safe npb-credential-one">
          {P("hero.icon.badge1", "Icon", <Award size={17} />)}
          <EditableText path="hero.badge1" content={content} editable={editable} onChange={onChange} {...editorProps} />
        </div>
        <div className="npb-face-safe npb-credential-two">
          {P("hero.icon.badge2", "Icon", <Building2 size={17} />)}
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
              <EditablePart path={`identity.cards.${index}.icon`} content={content} editable={editable} label="Icon" {...editorProps}>
                <Icon size={28} />
              </EditablePart>
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
            <EditablePart path={`proof.stats.${index}.icon`} content={content} editable={editable} label="Icon" {...editorProps}>
              <Icon size={24} />
            </EditablePart>
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
              <EditablePart path={`editorial.bullets.${index}.icon`} content={content} editable={editable} label="Icon" {...editorProps}>
                <CheckCircle2 size={18} />
              </EditablePart>
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
              <EditablePart path={`gallery.images.${index}.icon`} content={content} editable={editable} label="Icon" {...editorProps}>
                <KeyRound size={15} />
              </EditablePart>
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
            <EditablePart path={`method.steps.${index}.num`} content={content} editable={editable} label="Number" {...editorProps}>
              <span>{String(index + 1).padStart(2, "0")}</span>
            </EditablePart>
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
            <EditablePart path="contact.icon.cta" content={content} editable={editable} label="Icon" {...editorProps}>
              <CalendarCheck size={18} />
            </EditablePart>
            <EditableText path="contact.primaryCta" content={content} editable={editable} onChange={onChange} {...editorProps} />
            <EditablePart path="contact.icon.arrow" content={content} editable={editable} label="Icon" {...editorProps}>
              <ArrowRight size={18} />
            </EditablePart>
          </a>
          <a href={`tel:+1${content.contact.phone.replace(/\D/g, "")}`} className="npb-phone-link">
            <EditablePart path="contact.icon.phone" content={content} editable={editable} label="Icon" {...editorProps}>
              <Phone size={18} />
            </EditablePart>
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
        <EditablePart path="footer.icon.mail" content={content} editable={editable} label="Icon" {...editorProps}>
          <Mail size={18} />
        </EditablePart>
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
