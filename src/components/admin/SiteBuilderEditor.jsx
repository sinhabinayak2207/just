import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  LayoutGrid,
  Plus,
  Save,
  Trash2,
  Type as TypeIcon,
} from "lucide-react";
import LandingSections from "../landing/LandingSections";
import AssetPicker from "./AssetPicker";
import {
  addBuiltinSection,
  addCanvasElement,
  addCustomSection,
  BUILTIN_SECTION_IDS,
  characterMap,
  clearElementOverride,
  clearSectionOverride,
  CMS_TOKEN_KEY,
  DEFAULT_CONTENT,
  getByPath,
  getElementOverride,
  getSectionFields,
  getSectionOrder,
  getSectionOverride,
  isCustomSectionId,
  listContentFields,
  loadContent,
  loadContentFromApi,
  moveSection,
  removeCanvasElement,
  removeSection,
  resolveContent,
  saveContent,
  saveContentToApi,
  SECTIONS,
  sectionLabel,
  setByPath,
  setElementOverride,
  setSectionOverride,
  uploadAssetToApi,
} from "../../lib/siteContent";

// Which content path holds a section's built-in background image (so the
// section background control edits the real field for those sections).
const customElType = (content, path) => {
  const match = String(path).match(/^customSections\.([^.]+)\.items\.([^.]+)\.value$/);
  if (!match) return null;
  return content?.customSections?.[match[1]]?.items?.[match[2]]?.type || "text";
};

export default function SiteBuilderEditor() {
  const [content, setContent] = useState(() => loadContent());
  const [activeSection, setActiveSection] = useState("hero");
  const [jsonDraft, setJsonDraft] = useState(() => JSON.stringify(loadContent(), null, 2));
  const [adminToken, setAdminToken] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.sessionStorage.getItem(CMS_TOKEN_KEY) || "";
  });
  const [passwordDraft, setPasswordDraft] = useState("");
  const [status, setStatus] = useState("Loading Supabase content...");
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingPath, setUploadingPath] = useState("");
  const [selectedPath, setSelectedPath] = useState("hero.line1");
  const [addingSection, setAddingSection] = useState(false);

  const fields = useMemo(() => getSectionFields(activeSection, content), [activeSection, content]);
  const allFields = useMemo(() => listContentFields(content), [content]);
  const textFields = fields.filter((field) => field.type === "text");
  const assetFields = fields.filter((field) => field.type === "asset");
  const chars = useMemo(() => characterMap(content), [content]);

  const order = getSectionOrder(content);
  const missingBuiltins = BUILTIN_SECTION_IDS.filter((id) => !order.includes(id));

  const selectedSectionId = selectedPath.startsWith("section:") ? selectedPath.slice("section:".length) : "";
  const sectionOverride = selectedSectionId ? getSectionOverride(content, selectedSectionId) : {};

  const customType = customElType(content, selectedPath);
  const selectedField =
    allFields.find((field) => field.path === selectedPath) ||
    (customType ? { path: selectedPath, type: customType === "image" ? "asset" : "text" } : null);
  const selectedOverride = selectedPath && !selectedSectionId ? getElementOverride(content, selectedPath) : {};

  useEffect(() => {
    let mounted = true;
    loadContentFromApi()
      .then((remoteContent) => {
        if (!mounted) return;
        setContent(remoteContent);
        setJsonDraft(JSON.stringify(remoteContent, null, 2));
        setStatus("Loaded from Supabase. Edit the canvas, then save to publish.");
      })
      .catch((error) => {
        if (!mounted) return;
        setStatus(`Using local draft. Remote load failed: ${error.message}`);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Commit a new content object + keep the JSON mirror in sync.
  const commit = (producer) => {
    setContent((current) => {
      const next = typeof producer === "function" ? producer(current) : producer;
      setJsonDraft(JSON.stringify(next, null, 2));
      return next;
    });
  };

  const updateField = (path, value) => commit((current) => setByPath(current, path, value));
  const updateElementDesign = (path, patch) => {
    if (!path) return;
    commit((current) => setElementOverride(current, path, patch));
  };
  const resetElement = (path) => commit((current) => clearElementOverride(current, path));
  const resetElementDesign = () => {
    if (selectedPath) resetElement(selectedPath);
  };

  const updateSelectedNumber = (key, value) =>
    updateElementDesign(selectedPath, { [key]: value === "" ? "" : Number(value) });
  const updateSelectedText = (key, value) => updateElementDesign(selectedPath, { [key]: value });

  const selectElement = (path) => {
    setSelectedPath(path);
    const sectionId = path.split(".")[0];
    if (SECTIONS.some((section) => section.id === sectionId)) setActiveSection(sectionId);
  };
  const selectSection = (sid) => {
    setSelectedPath(`section:${sid}`);
    if (SECTIONS.some((section) => section.id === sid)) setActiveSection(sid);
  };

  // ── section (background) overrides ─────────────────────────────────────────
  const updateSection = (sid, patch) => commit((current) => setSectionOverride(current, sid, patch));
  const clearSection = (sid) => commit((current) => clearSectionOverride(current, sid));
  const uploadSectionBg = async (sid, file) => {
    if (!adminToken) {
      setStatus("Enter the CMS admin password before uploading assets.");
      return;
    }
    setUploadingPath(`section:${sid}`);
    setStatus(`Uploading ${file.name}...`);
    try {
      const uploaded = await uploadAssetToApi(file, adminToken);
      updateSection(sid, { bgImage: uploaded.url });
      setStatus("Background image uploaded. Click Save to publish.");
    } catch (error) {
      setStatus(`Asset upload failed: ${error.message}`);
    } finally {
      setUploadingPath("");
    }
  };

  // ── page layout (add / reorder / delete sections) ──────────────────────────
  const addCustom = () => {
    setAddingSection(false);
    setContent((current) => {
      const { content: next, id } = addCustomSection(current);
      setJsonDraft(JSON.stringify(next, null, 2));
      setSelectedPath(`section:${id}`);
      return next;
    });
  };
  const addBuiltin = (id) => {
    setAddingSection(false);
    commit((current) => addBuiltinSection(current, id));
  };
  const moveSectionDir = (id, direction) => commit((current) => moveSection(current, id, direction));
  const deleteSection = (id) => commit((current) => removeSection(current, id));
  const addCanvasEl = (sid, type) => {
    setContent((current) => {
      const { content: next, elementId } = addCanvasElement(current, sid, type);
      setJsonDraft(JSON.stringify(next, null, 2));
      setSelectedPath(`customSections.${sid}.items.${elementId}.value`);
      return next;
    });
  };
  const removeCanvasEl = (sid, eid) => commit((current) => removeCanvasElement(current, sid, eid));

  // ── supabase auth / persistence ────────────────────────────────────────────
  const handleUnlock = () => {
    const nextToken = passwordDraft.trim();
    if (!nextToken) {
      setStatus("Enter the CMS admin password before saving.");
      return;
    }
    window.sessionStorage.setItem(CMS_TOKEN_KEY, nextToken);
    setAdminToken(nextToken);
    setPasswordDraft("");
    setStatus("CMS password saved for this browser tab.");
  };
  const handleLoadRemote = async () => {
    setStatus("Loading latest Supabase content...");
    try {
      const remoteContent = await loadContentFromApi();
      commit(remoteContent);
      setStatus("Latest Supabase content loaded.");
    } catch (error) {
      setStatus(`Remote load failed: ${error.message}`);
    }
  };
  const handleSave = async () => {
    if (!adminToken) {
      setStatus("Enter the CMS admin password before saving to Supabase.");
      return;
    }
    setIsSaving(true);
    setStatus("Saving to Supabase...");
    saveContent(content);
    try {
      const saved = await saveContentToApi(content, adminToken);
      commit(saved);
      setStatus("Saved to Supabase. Vercel live site will read this content.");
    } catch (error) {
      setStatus(`Remote save failed: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  const handleReset = () => {
    const next = resolveContent(DEFAULT_CONTENT);
    saveContent(next);
    commit(next);
    setStatus("Reset to default draft. Click Save to publish this reset to Supabase.");
  };
  const handleImport = () => {
    try {
      const next = resolveContent(JSON.parse(jsonDraft));
      saveContent(next);
      commit(next);
      setStatus("JSON applied as local draft. Click Save to publish to Supabase.");
    } catch (error) {
      setStatus(`JSON import failed: ${error.message}`);
    }
  };
  const handleAssetUpload = async (path, file) => {
    if (!adminToken) {
      setStatus("Enter the CMS admin password before uploading assets.");
      return;
    }
    setUploadingPath(path);
    setStatus(`Uploading ${file.name}...`);
    try {
      const uploaded = await uploadAssetToApi(file, adminToken);
      updateField(path, uploaded.url);
      setStatus("Asset uploaded. Click Save to publish this image URL to Supabase content.");
    } catch (error) {
      setStatus(`Asset upload failed: ${error.message}`);
    } finally {
      setUploadingPath("");
    }
  };

  return (
    <div className="cms-builder">
      <header className="cms-topbar">
        <div className="cms-topbar-left">
          <span className="cms-logo">
            Nirav <b>Builder</b>
          </span>
          <span className="cms-topbar-hint">
            Click any text to edit · drag the chip to move · drag the corner to resize
          </span>
        </div>
        <div className="cms-topbar-right">
          <span className="cms-status">{status}</span>
          <a className="cms-ghost-btn" href="/preview" target="_blank" rel="noreferrer">
            Preview
          </a>
          <a className="cms-ghost-btn" href="/" target="_blank" rel="noreferrer">
            Open site
          </a>
          <button type="button" className="cms-primary-btn" onClick={handleSave} disabled={isSaving}>
            <Save size={15} />
            {isSaving ? "Saving…" : "Save & publish"}
          </button>
        </div>
      </header>

      <div className="cms-body">
        <aside className="cms-sidebar">
          <div className="cms-panel-group cms-auth">
            <h3>Supabase publish</h3>
            <p className="cms-muted">{status}</p>
            <label className="cms-field">
              <span>CMS_ADMIN_PASSWORD</span>
              <input
                type="password"
                value={passwordDraft}
                placeholder={adminToken ? "Unlocked for this tab" : "Enter password"}
                onChange={(event) => setPasswordDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleUnlock();
                }}
              />
            </label>
            <div className="cms-actions cms-actions-tight">
              <button type="button" onClick={handleUnlock}>
                Unlock
              </button>
              <button type="button" onClick={handleLoadRemote}>
                Reload remote
              </button>
            </div>
          </div>

          {/* ── page layout: add / reorder / delete sections ── */}
          <div className="cms-panel-group">
            <div className="cms-panel-head">
              <LayoutGrid size={15} />
              <h3>Page layout</h3>
              <span className="cms-pill">Canvas edits →</span>
            </div>

            {addingSection ? (
              <div className="cms-add-menu">
                <div className="cms-add-menu-head">
                  <span>Add a section</span>
                  <button type="button" className="cms-linkish" onClick={() => setAddingSection(false)}>
                    cancel
                  </button>
                </div>
                <button type="button" className="cms-add-item" onClick={addCustom}>
                  <Plus size={14} /> Custom canvas (blank)
                </button>
                {missingBuiltins.map((id) => (
                  <button type="button" className="cms-add-item" key={id} onClick={() => addBuiltin(id)}>
                    <Plus size={14} /> {sectionLabel(id)}
                  </button>
                ))}
              </div>
            ) : (
              <button type="button" className="cms-add-btn" onClick={() => setAddingSection(true)}>
                <Plus size={15} /> Add a section
              </button>
            )}

            <div className="cms-section-order">
              {order.map((id, index) => {
                const isSel = selectedPath === `section:${id}`;
                return (
                  <div key={id} className={`cms-order-row${isSel ? " is-active" : ""}`}>
                    <button type="button" className="cms-order-label" onClick={() => selectSection(id)}>
                      {isCustomSectionId(id) ? <TypeIcon size={13} /> : <Eye size={13} />}
                      <span>{sectionLabel(id)}</span>
                      {isCustomSectionId(id) && <em>custom</em>}
                    </button>
                    <button
                      type="button"
                      className="cms-icon-btn"
                      title="Move up"
                      disabled={index === 0}
                      onClick={() => moveSectionDir(id, "up")}
                    >
                      <ChevronUp size={15} />
                    </button>
                    <button
                      type="button"
                      className="cms-icon-btn"
                      title="Move down"
                      disabled={index === order.length - 1}
                      onClick={() => moveSectionDir(id, "down")}
                    >
                      <ChevronDown size={15} />
                    </button>
                    <button
                      type="button"
                      className="cms-icon-btn cms-danger"
                      title="Delete section"
                      onClick={() => deleteSection(id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── contextual inspector ── */}
          <div className="cms-panel-group cms-style-panel">
            <div className="cms-panel-head">
              <h3>{selectedSectionId ? "Section background" : "Selected element"}</h3>
            </div>

            {selectedSectionId ? (
              <SectionBgControls
                sid={selectedSectionId}
                override={sectionOverride}
                onChange={(patch) => updateSection(selectedSectionId, patch)}
                onClear={() => clearSection(selectedSectionId)}
                onUpload={(file) => uploadSectionBg(selectedSectionId, file)}
                uploading={uploadingPath === `section:${selectedSectionId}`}
              />
            ) : selectedField ? (
              <>
                <p className="cms-selected-path">{selectedField.path}</p>
                {selectedField.type === "asset" && (
                  <div className="cms-selected-asset">
                    <img src={String(getByPath(content, selectedField.path) || "")} alt="" />
                    <label className="cms-field">
                      <span>Image URL</span>
                      <input
                        value={String(getByPath(content, selectedField.path) || "")}
                        onChange={(event) => updateField(selectedField.path, event.target.value)}
                      />
                    </label>
                    <span className="cms-file-control">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) handleAssetUpload(selectedField.path, file);
                          event.target.value = "";
                        }}
                      />
                      <strong>{uploadingPath === selectedField.path ? "Uploading..." : "Replace selected image"}</strong>
                    </span>
                  </div>
                )}
                <div className="cms-style-grid">
                  <label><span>X</span><input type="number" value={selectedOverride.x ?? ""} onChange={(e) => updateSelectedNumber("x", e.target.value)} /></label>
                  <label><span>Y</span><input type="number" value={selectedOverride.y ?? ""} onChange={(e) => updateSelectedNumber("y", e.target.value)} /></label>
                  <label><span>W</span><input type="number" value={selectedOverride.w ?? ""} onChange={(e) => updateSelectedNumber("w", e.target.value)} /></label>
                  <label><span>H</span><input type="number" value={selectedOverride.h ?? ""} onChange={(e) => updateSelectedNumber("h", e.target.value)} /></label>
                  <label><span>Font</span><input type="number" value={selectedOverride.fontSize ?? ""} onChange={(e) => updateSelectedNumber("fontSize", e.target.value)} /></label>
                  <label><span>Z</span><input type="number" value={selectedOverride.zIndex ?? ""} onChange={(e) => updateSelectedNumber("zIndex", e.target.value)} /></label>
                  <label><span>Radius</span><input type="number" value={selectedOverride.radius ?? ""} onChange={(e) => updateSelectedNumber("radius", e.target.value)} /></label>
                  <label><span>Pad</span><input type="number" value={selectedOverride.padding ?? ""} onChange={(e) => updateSelectedNumber("padding", e.target.value)} /></label>
                  <label><span>Color</span><input value={selectedOverride.color ?? ""} placeholder="#ffffff" onChange={(e) => updateSelectedText("color", e.target.value)} /></label>
                  <label><span>BG</span><input value={selectedOverride.background ?? ""} placeholder="transparent" onChange={(e) => updateSelectedText("background", e.target.value)} /></label>
                  <label><span>Opacity</span><input type="number" min="0" max="1" step="0.05" value={selectedOverride.opacity ?? ""} onChange={(e) => updateSelectedNumber("opacity", e.target.value)} /></label>
                  <label>
                    <span>Fit</span>
                    <select value={selectedOverride.objectFit ?? ""} onChange={(e) => updateSelectedText("objectFit", e.target.value)}>
                      <option value="">auto</option>
                      <option value="cover">cover</option>
                      <option value="contain">contain</option>
                      <option value="fill">fill</option>
                    </select>
                  </label>
                </div>
                <button type="button" onClick={resetElementDesign}>
                  Reset selected style
                </button>
              </>
            ) : (
              <p className="cms-muted">Click any text or image on the canvas, or a section to style its background.</p>
            )}
          </div>

          <div className="cms-panel-group">
            <div className="cms-panel-head">
              <h3>Content fields</h3>
            </div>
            <div className="cms-section-list">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className={activeSection === section.id ? "is-active" : ""}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          <details className="cms-panel-group cms-details">
            <summary>Text fields</summary>
            <div className="cms-details-body">
              {textFields.map((field) => (
                <label key={field.path} className="cms-field">
                  <span>{field.path}</span>
                  <textarea value={String(getByPath(content, field.path) || "")} onChange={(event) => updateField(field.path, event.target.value)} />
                </label>
              ))}
            </div>
          </details>

          <AssetPicker
            fields={assetFields}
            content={content}
            getValue={getByPath}
            onChange={updateField}
            onUpload={handleAssetUpload}
            uploadingPath={uploadingPath}
          />

          <details className="cms-panel-group cms-details">
            <summary>Character map</summary>
            <div className="cms-details-body">
              <p className="cms-muted">{chars.length} editable characters mapped across the site.</p>
              <div className="cms-char-map">
                {chars.map((item) => (
                  <span key={item.key} title={`${item.path} [${item.index}] U+${item.code.toString(16).toUpperCase()}`}>
                    {item.char === " " ? "·" : item.char}
                  </span>
                ))}
              </div>
            </div>
          </details>

          <div className="cms-actions">
            <button type="button" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save to Supabase"}
            </button>
            <button type="button" onClick={handleReset}>
              Reset
            </button>
          </div>

          <details className="cms-panel-group cms-details">
            <summary>JSON export / import</summary>
            <div className="cms-details-body">
              <textarea className="cms-json" value={jsonDraft} onChange={(event) => setJsonDraft(event.target.value)} />
              <button type="button" onClick={handleImport}>
                Apply JSON
              </button>
            </div>
          </details>
        </aside>

        <section className="cms-canvas">
          <div className="cms-canvas-scroll">
            <div className="cms-canvas-frame">
              <LandingSections
                content={content}
                editable
                onChange={updateField}
                showCmsButton={false}
                showHeader
                selectedPath={selectedPath}
                onSelect={selectElement}
                onMove={updateElementDesign}
                onResize={updateElementDesign}
                onDesign={updateElementDesign}
                onReset={resetElement}
                onSelectSection={selectSection}
                onAddCanvasElement={addCanvasEl}
                onRemoveCanvasElement={removeCanvasEl}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Section background inspector: solid colour / gradient / image + overlay.
function SectionBgControls({ sid, override, onChange, onClear, onUpload, uploading }) {
  return (
    <div className="cms-bg-controls">
      <p className="cms-selected-path">{sectionLabel(sid)} section</p>

      <div className="cms-bg-row">
        <label className="cms-field cms-bg-color">
          <span>Solid colour</span>
          <input
            type="color"
            value={override.bg || "#101010"}
            onChange={(event) => onChange({ bg: event.target.value, gradFrom: "", gradTo: "" })}
          />
        </label>
        <button type="button" className="cms-linkish" onClick={() => onChange({ bg: "" })}>
          clear
        </button>
      </div>

      <div className="cms-style-grid">
        <label className="cms-bg-color"><span>Grad from</span><input type="color" value={override.gradFrom || "#ff7a00"} onChange={(e) => onChange({ gradFrom: e.target.value, bg: "" })} /></label>
        <label className="cms-bg-color"><span>Grad to</span><input type="color" value={override.gradTo || "#101010"} onChange={(e) => onChange({ gradTo: e.target.value, bg: "" })} /></label>
        <label><span>Angle</span><input type="number" value={override.gradAngle ?? ""} placeholder="135" onChange={(e) => onChange({ gradAngle: e.target.value === "" ? "" : Number(e.target.value) })} /></label>
        <label>
          <span>Img fit</span>
          <select value={override.bgFit || ""} onChange={(e) => onChange({ bgFit: e.target.value })}>
            <option value="">cover</option>
            <option value="cover">cover</option>
            <option value="contain">contain</option>
          </select>
        </label>
      </div>

      <label className="cms-field">
        <span>Background image URL</span>
        <input value={override.bgImage || ""} placeholder="https://…" onChange={(event) => onChange({ bgImage: event.target.value })} />
      </label>
      <div className="cms-bg-row">
        <span className="cms-file-control">
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onUpload(file);
              event.target.value = "";
            }}
          />
          <strong>{uploading ? "Uploading..." : "Upload / replace image"}</strong>
        </span>
        {override.bgImage && (
          <button type="button" className="cms-linkish" onClick={() => onChange({ bgImage: "" })}>
            remove image
          </button>
        )}
      </div>

      <div className="cms-style-grid">
        <label><span>Overlay</span><input type="number" min="0" max="1" step="0.05" value={override.overlay ?? ""} placeholder="0–1" onChange={(e) => onChange({ overlay: e.target.value === "" ? "" : Number(e.target.value) })} /></label>
        <label className="cms-bg-color"><span>Overlay col</span><input type="color" value={override.overlayColor || "#000000"} onChange={(e) => onChange({ overlayColor: e.target.value })} /></label>
      </div>

      <button type="button" onClick={onClear}>
        Clear section background
      </button>
    </div>
  );
}
