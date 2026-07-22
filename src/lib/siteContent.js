export const STORAGE_KEY = "nirav_site_content_v1";
export const CMS_TOKEN_KEY = "nirav_cms_admin_token";

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

export function listContentFields(content = DEFAULT_CONTENT) {
  const fields = [];
  walk(content, "", fields);
  return fields;
}

function walk(value, path, fields) {
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
