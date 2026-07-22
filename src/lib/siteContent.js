export const STORAGE_KEY = "nirav_site_content_v1";
export const CMS_TOKEN_KEY = "nirav_cms_admin_token";

// Curated Google Fonts offered in the typography picker (loaded on demand via a
// <link> to fonts.googleapis.com — only the families actually used are fetched).
export const GOOGLE_FONTS = [
  "Inter", "Poppins", "Montserrat", "Roboto", "Open Sans", "Lato", "Raleway",
  "Playfair Display", "Merriweather", "Space Grotesk", "DM Sans", "Manrope",
  "Sora", "Outfit", "Plus Jakarta Sans", "Archivo", "Bebas Neue", "Oswald",
  "Nunito", "Nunito Sans", "Work Sans", "Rubik", "Karla", "Mulish", "Quicksand",
  "Josefin Sans", "Barlow", "Cabin", "PT Sans", "PT Serif", "Source Sans 3",
  "Source Serif 4", "Libre Franklin", "Libre Baskerville", "Fira Sans",
  "Fira Code", "IBM Plex Sans", "IBM Plex Serif", "IBM Plex Mono", "Roboto Mono",
  "Roboto Slab", "Roboto Condensed", "Titillium Web", "Cairo", "Hind",
  "Kanit", "Prompt", "Heebo", "Assistant", "Dosis", "Teko", "Anton",
  "Archivo Black", "Abril Fatface", "Bitter", "Crimson Text", "Cormorant",
  "Cormorant Garamond", "EB Garamond", "Lora", "Domine", "Zilla Slab",
  "Arvo", "Alegreya", "Alegreya Sans", "Vollkorn", "Spectral", "Noto Sans",
  "Noto Serif", "Exo 2", "Saira", "Chivo", "Red Hat Display", "Red Hat Text",
  "Epilogue", "Figtree", "Onest", "Schibsted Grotesk", "Instrument Sans",
  "Bricolage Grotesque", "Unbounded", "Syne", "Fraunces", "Newsreader",
  "Signika", "Overpass", "Jost", "Lexend", "Urbanist", "Public Sans",
  "Albert Sans", "Be Vietnam Pro", "DM Serif Display", "DM Serif Text",
  "Marcellus", "Philosopher", "Righteous", "Comfortaa", "Pacifico",
  "Dancing Script", "Caveat", "Sacramento", "Satisfy", "Lobster",
  "Great Vibes", "Shadows Into Light", "Permanent Marker", "Kalam",
];

export const FONT_WEIGHTS = ["300", "400", "500", "600", "700", "800"];

// Box-shadow presets (match the Tenderbuddy StylePanel intensities).
export const SHADOW_PRESETS = {
  none: "none",
  sm: "0 1px 2px rgba(0,0,0,0.18)",
  md: "0 6px 16px -4px rgba(0,0,0,0.35)",
  lg: "0 16px 40px -10px rgba(0,0,0,0.45)",
  xl: "0 30px 70px -20px rgba(0,0,0,0.6)",
  glow: "0 0 0 1px rgba(255,122,0,0.4), 0 12px 40px -8px rgba(255,122,0,0.5)",
};

const cssFontFamily = (family) => `'${String(family).replace(/[^a-zA-Z0-9 _-]/g, "")}', sans-serif`;

export const DEFAULT_ORDER = [
  "hero",
  "brandStrip",
  "identity",
  "proof",
  "editorial",
  "gallery",
  "method",
  "contact",
  "footer",
];

const media = (file) => `https://niravpatel.ca/_assets/media/${file}`;

export const DEFAULT_CONTENT = {
  design: {
    elements: {},
    sections: {},
  },
  layout: {
    order: [...DEFAULT_ORDER],
  },
  customSections: {},
  freeItems: {},
  nav: {
    brandName: "Nirav Patel",
    brandRole: "Realtor",
    links: [
      { label: "Identity", href: "#identity" },
      { label: "Proof", href: "#proof" },
      { label: "Method", href: "#method" },
      { label: "Contact", href: "#contact" },
    ],
    phone: "416-505-0521",
  },
  hero: {
    watermark: "Nirav",
    kicker: "Personal brand / Ontario real estate",
    line1: "Nirav Patel",
    line2: "sees what",
    line3: "others miss.",
    body: "A realtor with builder-level eyes, negotiation discipline, and the calm to help families make expensive decisions without second-guessing every move.",
    primaryCta: "Book Nirav",
    secondaryCta: "His edge",
    backgroundImage: media("715b5063bc5e9630d6cb5aa05455cb0d.jpg"),
    portraitImage: media("def10c275a38472b55e20fa60a3998ac.png"),
    badge1: "Certified negotiation expert",
    badge2: "Tarion builder insight",
    proof1: "120+ homes sold",
    proof2: "436 offers negotiated",
    proof3: "KWC to Durham",
  },
  brandStrip: {
    items: ["Honest advice", "Builder eyes", "Sharp offers", "Calm closings", "Client first"],
  },
  identity: {
    kicker: "The identity",
    title: "The personal brand is not luxury. It is trust with teeth.",
    body: "Nirav should not look like another realtor with a suit and a slogan. The brand should feel specific: builder knowledge, direct advice, negotiation pressure, and real client wins.",
    cards: [
      {
        title: "Builder eyes",
        body: "Tarion builder experience changes how a home is read: structure, finish, risk, and the questions hidden behind fresh paint.",
      },
      {
        title: "Negotiator pulse",
        body: "Every deal gets a leverage map: price, timing, clauses, seller pressure, inspection risk, and closing control.",
      },
      {
        title: "Calm execution",
        body: "Clients get clear next steps instead of panic. The process stays human, direct, and clean from first call to keys.",
      },
    ],
  },
  proof: {
    stats: [
      { value: "120", suffix: "+", label: "Homes sold" },
      { value: "436", suffix: "", label: "Offers negotiated" },
      { value: "6", suffix: "+", label: "Years in real estate" },
      { value: "100", suffix: "%", label: "Client-first posture" },
    ],
  },
  editorial: {
    kicker: "Why him",
    title: "He does not just open doors. He reads the house.",
    body: "A first showing can hide thousands in risk. Nirav's edge is asking better questions before clients fall in love with the wrong property or leave money on the table.",
    image: media("5f4a3490025f0d195f2d5f1a4c9f2720.jpg"),
    bullets: [
      "Surface finish versus real condition",
      "Price pressure before offer night",
      "Negotiation terms beyond just price",
    ],
  },
  gallery: {
    kicker: "Real moments",
    title: "The brand proof is the families.",
    body: "The site should feel personal because the results are personal: keys, families, trust, and the relief that comes when a complex move finally closes cleanly.",
    caption: "Closed with Nirav",
    images: [
      media("715b5063bc5e9630d6cb5aa05455cb0d.jpg"),
      media("6aecd3086e0ef586bb51531f6e096647.jpg"),
      media("d1d490c5493e75a2b4cd94662c5775e4.png"),
      media("f0aa897efae3f43649348c2fcc1490b8.png"),
      media("eebfc111540b5e769298d11b491055e5.jpg"),
      media("8d1fa091d63738beecc2909c34a0b0d0.jpg"),
      media("f77d0b90966b45fb9e50bdb973956496.jpg"),
      media("83521480f1608091fbca3707c9ef3d15.jpg"),
    ],
  },
  method: {
    kicker: "The method",
    title: "A calm process for high-stakes decisions.",
    steps: [
      "Read the property beyond the listing",
      "Map risk, timing, and pressure",
      "Build the offer or launch strategy",
      "Negotiate without emotional noise",
      "Close with clean details",
    ],
  },
  contact: {
    kicker: "Talk to Nirav",
    title: "Bring the goal. Leave with the next move.",
    body: "Buying, selling, or investing across the GTA, KWC, or Durham? Start with a direct call and a practical read on your situation.",
    image: media("63f978b9e160aeec9ae0dcbdccde6321.jpg"),
    primaryCta: "Book a call",
    phone: "416-505-0521",
    email: "info@niravpatel.ca",
    bookingUrl: "https://calendly.com/nirav-realtor/30min",
  },
  footer: {
    name: "Nirav Patel",
    line: "Realtor / Brampton, Ontario",
    email: "info@niravpatel.ca",
  },
};

const SECTION_LABELS = {
  nav: "Navigation",
  hero: "Hero",
  brandStrip: "Brand Strip",
  identity: "Identity",
  proof: "Proof Stats",
  editorial: "Builder Story",
  gallery: "Client Gallery",
  method: "Method",
  contact: "Contact",
  footer: "Footer",
};

export const SECTIONS = ["nav", ...DEFAULT_ORDER].map((id) => ({
  id,
  label: SECTION_LABELS[id],
}));

export function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function resolveContent(content) {
  return mergeDeep(deepClone(DEFAULT_CONTENT), content || {});
}

export function mergeDeep(target, source) {
  if (!source || typeof source !== "object") return target;
  for (const [key, value] of Object.entries(source)) {
    if (Array.isArray(value)) {
      target[key] = value.map((item) => (item && typeof item === "object" ? deepClone(item) : item));
    } else if (value && typeof value === "object") {
      target[key] = mergeDeep(target[key] || {}, value);
    } else {
      target[key] = value;
    }
  }
  return target;
}

export function getByPath(object, path) {
  return path.split(".").reduce((current, part) => current?.[part], object);
}

export function setByPath(object, path, value) {
  const next = deepClone(object);
  const parts = path.split(".");
  let cursor = next;
  parts.slice(0, -1).forEach((part, index) => {
    const nextPart = parts[index + 1];
    if (cursor[part] === undefined) cursor[part] = Number.isFinite(Number(nextPart)) ? [] : {};
    cursor = cursor[part];
  });
  cursor[parts[parts.length - 1]] = value;
  return next;
}

export function encodeElementPath(path) {
  return String(path).replace(/[^a-zA-Z0-9_-]/g, "__");
}

export function getElementOverride(content, path) {
  const key = encodeElementPath(path);
  return content?.design?.elements?.[key] || {};
}

export function setElementOverride(content, path, patch) {
  const next = deepClone(content);
  const key = encodeElementPath(path);
  if (!next.design) next.design = {};
  if (!next.design.elements) next.design.elements = {};

  const previous = next.design.elements[key] || { path };
  next.design.elements[key] = cleanOverride({
    ...previous,
    path,
    ...patch,
  });

  return next;
}

export function clearElementOverride(content, path) {
  const next = deepClone(content);
  const key = encodeElementPath(path);
  if (next.design?.elements) delete next.design.elements[key];
  return next;
}

export function buildElementStyle(content, path, editable = false) {
  const override = getElementOverride(content, path);
  const style = {};

  // Move (translate) + per-axis scale — a horizontal resize drag grows scaleX,
  // a vertical drag grows scaleY, so text/images grow instead of just re-padding.
  const tx = Number(override.x) || 0;
  const ty = Number(override.y) || 0;
  if (tx || ty) {
    style.transform = `translate(${tx}px, ${ty}px)`;
    style.transformOrigin = "top left";
  }

  if (override.w) style.width = `${Number(override.w)}px`;
  if (override.h) style.height = `${Number(override.h)}px`;
  if (override.color) style.color = override.color;
  if (override.background) style.background = override.background;
  if (override.fontSize) style.fontSize = `${Number(override.fontSize)}px`;
  if (override.fontFamily) style.fontFamily = cssFontFamily(override.fontFamily);
  if (override.fontWeight) style.fontWeight = override.fontWeight;
  if (override.letterSpacing) style.letterSpacing = override.letterSpacing;
  if (override.lineHeight) style.lineHeight = override.lineHeight;
  if (override.textAlign) style.textAlign = override.textAlign;
  if (override.radius) style.borderRadius = `${Number(override.radius)}px`;
  if (override.padding) style.padding = `${Number(override.padding)}px`;
  if (override.opacity) style.opacity = Number(override.opacity);
  if (override.zIndex) style.zIndex = Number(override.zIndex);
  if (override.objectFit) style.objectFit = override.objectFit;
  if (override.borderWidth) {
    style.border = `${Number(override.borderWidth)}px solid ${override.borderColor || "#ffffff"}`;
  }
  if (override.shadow && SHADOW_PRESETS[override.shadow]) style.boxShadow = SHADOW_PRESETS[override.shadow];

  if (Object.keys(style).length || editable) {
    // Only force a positioning context when editing (chips/handles need it) or
    // when the element carries a z-index. On the public site we must NOT clobber
    // an element's own CSS position (e.g. the absolutely-placed hero portrait) —
    // a transform move/scale applies fine without it, and overriding it would
    // knock the element out of place.
    if (editable || override.zIndex != null) style.position = "relative";
    style.display = override.display || "inline-block";
  }

  // Clip only images (object-fit crop); text must reflow, never be clipped.
  if (override.h && override.objectFit) {
    style.overflow = "hidden";
  }

  return style;
}

// Stable data-attribute value used to scope a per-element style rule.
export function elementCxcClass(path) {
  return `cxc-${encodeElementPath(path)}`;
}

// Typography + colour can't just live on the wrapper — the real text sits in
// children that carry their own classes, so those declarations win. Emit a
// scoped rule that also targets descendants with !important (like Tenderbuddy),
// so font family / weight / size / colour / spacing / alignment actually apply.
export function buildElementScopedCss(content, path) {
  const o = getElementOverride(content, path);
  const d = [];
  if (o.color) d.push(`color:${o.color} !important`);
  if (o.fontFamily) d.push(`font-family:${cssFontFamily(o.fontFamily)} !important`);
  if (o.fontWeight) d.push(`font-weight:${o.fontWeight} !important`);
  if (o.fontSize) d.push(`font-size:${Number(o.fontSize)}px !important`);
  if (o.lineHeight) d.push(`line-height:${o.lineHeight} !important`);
  if (o.letterSpacing) d.push(`letter-spacing:${o.letterSpacing} !important`);
  if (o.textAlign) d.push(`text-align:${o.textAlign} !important`);
  if (!d.length) return "";
  const cxc = elementCxcClass(path);
  return `[data-cxc="${cxc}"],[data-cxc="${cxc}"] *{${d.join(";")}}`;
}

export function sectionCxcClass(sid) {
  return `sec-${encodeElementPath(sid)}`;
}

// Whole-section typography / colour override, applied to the section + its
// descendants via a scoped !important rule (same trick as elements).
export function buildSectionScopedCss(content, sid) {
  const o = getSectionOverride(content, sid);
  const d = [];
  if (o.color) d.push(`color:${o.color} !important`);
  if (o.fontFamily) d.push(`font-family:${cssFontFamily(o.fontFamily)} !important`);
  if (o.fontWeight) d.push(`font-weight:${o.fontWeight} !important`);
  if (o.textAlign) d.push(`text-align:${o.textAlign} !important`);
  if (!d.length) return "";
  const cxc = sectionCxcClass(sid);
  return `[data-cxc-sec="${cxc}"],[data-cxc-sec="${cxc}"] *{${d.join(";")}}`;
}

// Every Google font family referenced by any element/section override.
export function collectFontFamilies(content) {
  const fams = new Set();
  const els = content?.design?.elements || {};
  for (const key of Object.keys(els)) {
    if (els[key]?.fontFamily) fams.add(els[key].fontFamily);
  }
  const secs = content?.design?.sections || {};
  for (const key of Object.keys(secs)) {
    if (secs[key]?.fontFamily) fams.add(secs[key].fontFamily);
  }
  return [...fams].filter((f) => GOOGLE_FONTS.includes(f));
}

// Build a fonts.googleapis.com stylesheet href for the families actually used.
export function googleFontsHref(families) {
  const fams = [...new Set((families || []).filter((f) => GOOGLE_FONTS.includes(f)))];
  if (!fams.length) return "";
  const q = fams.map((f) => `family=${f.replace(/ /g, "+")}:wght@300;400;500;600;700;800`).join("&");
  return `https://fonts.googleapis.com/css2?${q}&display=swap`;
}

export function listContentFields(content = DEFAULT_CONTENT) {
  const fields = [];
  walk(content, "", fields);
  return fields;
}

function walk(value, path, fields) {
  // Editor-only structures are not path-editable text fields.
  if (path === "design" || path.startsWith("design.")) return;
  if (path === "layout" || path.startsWith("layout.")) return;
  if (path === "customSections" || path.startsWith("customSections.")) return;
  if (path === "freeItems" || path.startsWith("freeItems.")) return;

  if (typeof value === "string") {
    fields.push({ path, type: isAssetPath(path, value) ? "asset" : "text", value });
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, path ? `${path}.${index}` : String(index), fields));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, child]) => walk(child, path ? `${path}.${key}` : key, fields));
  }
}

function isAssetPath(path, value) {
  return /image|photo|logo|asset/i.test(path) || /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(value);
}

export function getSectionFields(sectionId, content = DEFAULT_CONTENT) {
  return listContentFields(content).filter((field) => field.path.startsWith(`${sectionId}.`));
}

export function characterMap(content = DEFAULT_CONTENT) {
  return listContentFields(content)
    .filter((field) => field.type === "text")
    .flatMap((field) =>
      [...String(field.value)].map((char, index) => ({
        key: `${field.path}:${index}`,
        path: field.path,
        index,
        char,
        code: char.codePointAt(0),
      })),
    );
}

function cleanOverride(override) {
  return Object.fromEntries(
    Object.entries(override).filter(([, value]) => value !== "" && value !== null && value !== undefined),
  );
}

export function loadContent() {
  if (typeof window === "undefined") return resolveContent();
  try {
    return resolveContent(JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}"));
  } catch {
    return resolveContent();
  }
}

export function saveContent(content) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

export async function loadContentFromApi() {
  if (typeof window === "undefined") return resolveContent();

  const response = await fetch("/api/admin/content", {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await readError(response);
    throw new Error(message || `Content load failed (${response.status})`);
  }

  if (!String(response.headers.get("content-type") || "").includes("application/json")) {
    throw new Error("CMS API is not available on this local dev server.");
  }

  const payload = await response.json();
  const content = resolveContent(payload.content || payload.value || payload);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  return content;
}

export async function saveContentToApi(content, token) {
  const response = await fetch("/api/admin/content", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token || ""}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const message = await readError(response);
    throw new Error(message || `Content save failed (${response.status})`);
  }

  const payload = await response.json();
  const saved = resolveContent(payload.content || content);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  return saved;
}

export async function uploadAssetToApi(file, token) {
  const dataUrl = await fileToDataUrl(file);
  const response = await fetch("/api/admin/assets", {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token || ""}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type || "application/octet-stream",
      dataUrl,
    }),
  });

  if (!response.ok) {
    const message = await readError(response);
    throw new Error(message || `Asset upload failed (${response.status})`);
  }

  return response.json();
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}

async function readError(response) {
  try {
    const payload = await response.json();
    return payload.error || payload.message || "";
  } catch {
    return "";
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   Dynamic section order + custom canvas sections + per-section backgrounds.
   All of this persists inside the same path-based content model:
     content.layout.order    → array of section ids (built-in id or "custom-xxx")
     content.customSections  → { "custom-xxx": { height, order:[eid], items:{eid:{type,value}} } }
     content.design.sections → { "<sid>": { bg, gradFrom, gradTo, gradAngle, bgImage, bgFit, bgPos, overlay, overlayColor } }
   ──────────────────────────────────────────────────────────────────────────── */

export const BUILTIN_SECTION_IDS = [...DEFAULT_ORDER];

export function sectionLabel(id) {
  if (isCustomSectionId(id)) return "Custom canvas";
  return SECTION_LABELS[id] || id;
}

let _seq = 0;
export function newId(prefix = "id") {
  _seq += 1;
  return `${prefix}-${Date.now().toString(36)}-${_seq.toString(36)}`;
}

export function isCustomSectionId(id) {
  return typeof id === "string" && id.startsWith("custom-");
}

export function getSectionOrder(content) {
  const order = content?.layout?.order;
  if (Array.isArray(order) && order.length) {
    return order.filter((id) => typeof id === "string");
  }
  return [...DEFAULT_ORDER];
}

function writeSectionOrder(content, order) {
  const next = deepClone(content);
  if (!next.layout) next.layout = {};
  next.layout.order = order;
  return next;
}

export function moveSection(content, id, direction) {
  const order = getSectionOrder(content);
  const index = order.indexOf(id);
  if (index === -1) return content;
  const target = index + (direction === "up" ? -1 : 1);
  if (target < 0 || target >= order.length) return content;
  const next = [...order];
  const [moved] = next.splice(index, 1);
  next.splice(target, 0, moved);
  return writeSectionOrder(content, next);
}

export function removeSection(content, id) {
  const order = getSectionOrder(content).filter((sid) => sid !== id);
  let next = writeSectionOrder(content, order);
  // Clean any custom section body + per-section + per-element overrides it owned.
  if (isCustomSectionId(id)) {
    if (next.customSections) delete next.customSections[id];
    if (next.design?.elements) {
      const prefix = encodeElementPath(`customSections.${id}.`);
      for (const key of Object.keys(next.design.elements)) {
        if (key.startsWith(prefix)) delete next.design.elements[key];
      }
    }
  }
  // Free overlay elements attached to this section (any section can carry them).
  if (next.freeItems) delete next.freeItems[id];
  if (next.design?.elements) {
    const fprefix = encodeElementPath(`freeItems.${id}.`);
    for (const key of Object.keys(next.design.elements)) {
      if (key.startsWith(fprefix)) delete next.design.elements[key];
    }
  }
  if (next.design?.sections) delete next.design.sections[id];
  return next;
}

export function addBuiltinSection(content, id) {
  const order = getSectionOrder(content);
  if (order.includes(id)) return content;
  return writeSectionOrder(content, [...order, id]);
}

export function addCustomSection(content) {
  const id = newId("custom");
  const next = deepClone(content);
  if (!next.customSections) next.customSections = {};
  next.customSections[id] = { height: 480, order: [], items: {} };
  const withOrder = writeSectionOrderInPlace(next, [...getSectionOrder(next), id]);
  return { content: withOrder, id };
}

function writeSectionOrderInPlace(next, order) {
  if (!next.layout) next.layout = {};
  next.layout.order = order;
  return next;
}

export function getCustomSection(content, id) {
  const section = content?.customSections?.[id];
  if (!section) return { height: 480, order: [], items: {} };
  return {
    height: Number(section.height) || 480,
    order: Array.isArray(section.order) ? section.order : [],
    items: section.items || {},
  };
}

export function setCustomSectionMeta(content, id, patch) {
  const next = deepClone(content);
  if (!next.customSections) next.customSections = {};
  if (!next.customSections[id]) next.customSections[id] = { height: 480, order: [], items: {} };
  next.customSections[id] = { ...next.customSections[id], ...patch };
  return next;
}

export function addCanvasElement(content, sectionId, type = "text") {
  const eid = newId("el");
  const next = deepClone(content);
  if (!next.customSections) next.customSections = {};
  if (!next.customSections[sectionId]) next.customSections[sectionId] = { height: 480, order: [], items: {} };
  const section = next.customSections[sectionId];
  if (!section.items) section.items = {};
  if (!Array.isArray(section.order)) section.order = [];
  section.items[eid] =
    type === "image"
      ? { type: "image", value: "" }
      : { type: "text", value: "New text" };
  section.order = [...section.order, eid];
  // Seed a starting position so fresh elements don't all stack at 0,0.
  const offset = (section.order.length - 1) * 26;
  const seed = type === "image" ? { x: 40 + offset, y: 40 + offset, w: 260, h: 180 } : { x: 40 + offset, y: 40 + offset };
  const withOverride = setElementOverride(next, `customSections.${sectionId}.items.${eid}.value`, seed);
  return { content: withOverride, elementId: eid };
}

export function removeCanvasElement(content, sectionId, elementId) {
  let next = deepClone(content);
  const section = next.customSections?.[sectionId];
  if (section) {
    if (section.items) delete section.items[elementId];
    if (Array.isArray(section.order)) section.order = section.order.filter((id) => id !== elementId);
  }
  next = clearElementOverride(next, `customSections.${sectionId}.items.${elementId}.value`);
  return next;
}

/* ── free overlay elements (Add text / Add image to ANY section) ───────────────
   content.freeItems[sectionId] = { eid: { type: 'text'|'image', value } }
   Position / size / style live in the same design.elements override map, keyed
   by the path `freeItems.<sid>.<eid>.value`, so they move / resize / colour /
   style exactly like every other editable element. Rendered as absolutely
   positioned overlays inside that section's frame (edit + public).
   ──────────────────────────────────────────────────────────────────────────── */

export function getFreeItems(content, sectionId) {
  const map = content?.freeItems?.[sectionId];
  return map && typeof map === "object" ? map : {};
}

export function addFreeItem(content, sectionId, type = "text") {
  const eid = newId("free");
  const next = deepClone(content);
  if (!next.freeItems) next.freeItems = {};
  if (!next.freeItems[sectionId]) next.freeItems[sectionId] = {};
  next.freeItems[sectionId][eid] =
    type === "image"
      ? { type: "image", value: "" }
      : { type: "text", value: "New text" };
  // Seed a starting position so fresh elements don't all stack at 0,0.
  const count = Object.keys(next.freeItems[sectionId]).length;
  const offset = (count - 1) * 26;
  const seed =
    type === "image"
      ? { x: 60 + offset, y: 60 + offset, w: 240, h: 170 }
      : { x: 60 + offset, y: 60 + offset };
  const withOverride = setElementOverride(next, `freeItems.${sectionId}.${eid}.value`, seed);
  return { content: withOverride, elementId: eid };
}

export function removeFreeItem(content, sectionId, elementId) {
  let next = deepClone(content);
  if (next.freeItems?.[sectionId]) delete next.freeItems[sectionId][elementId];
  next = clearElementOverride(next, `freeItems.${sectionId}.${elementId}.value`);
  return next;
}

// Which section a selected path belongs to (used to target "Add element").
export function sectionIdForPath(content, path) {
  if (!path) return null;
  if (path.startsWith("section:")) return path.slice("section:".length);
  const free = path.match(/^freeItems\.([^.]+)\./);
  if (free) return free[1];
  const custom = path.match(/^customSections\.([^.]+)\./);
  if (custom) return custom[1];
  const seg = String(path).split(".")[0];
  if (getSectionOrder(content).includes(seg)) return seg;
  return null;
}

/* ── per-section background overrides ─────────────────────────────────────── */

export function getSectionOverride(content, sectionId) {
  return content?.design?.sections?.[sectionId] || {};
}

export function setSectionOverride(content, sectionId, patch) {
  const next = deepClone(content);
  if (!next.design) next.design = {};
  if (!next.design.sections) next.design.sections = {};
  const previous = next.design.sections[sectionId] || {};
  next.design.sections[sectionId] = cleanOverride({ ...previous, ...patch });
  return next;
}

export function clearSectionOverride(content, sectionId) {
  const next = deepClone(content);
  if (next.design?.sections) delete next.design.sections[sectionId];
  return next;
}

// Returns { hasBg, layerStyle, overlayStyle } describing the section background.
export function buildSectionBackground(content, sectionId) {
  const o = getSectionOverride(content, sectionId);
  const layerStyle = {};
  let hasBg = false;

  if (o.bgImage) {
    layerStyle.backgroundImage = `url("${o.bgImage}")`;
    layerStyle.backgroundSize = o.bgFit === "contain" ? "contain" : "cover";
    layerStyle.backgroundPosition = o.bgPos || "center";
    layerStyle.backgroundRepeat = "no-repeat";
    hasBg = true;
  } else if (o.gradFrom && o.gradTo) {
    layerStyle.backgroundImage = `linear-gradient(${Number(o.gradAngle) || 135}deg, ${o.gradFrom}, ${o.gradTo})`;
    hasBg = true;
  } else if (o.bg) {
    layerStyle.background = o.bg;
    hasBg = true;
  }

  const overlay = Number(o.overlay) || 0;
  const overlayStyle =
    overlay > 0 ? { background: o.overlayColor || "#000000", opacity: overlay } : null;

  return { hasBg: hasBg || !!overlayStyle, hasImage: !!o.bgImage, layerStyle, overlayStyle };
}
