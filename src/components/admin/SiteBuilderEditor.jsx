import React, { useEffect, useMemo, useState } from "react";
import LandingSections from "../landing/LandingSections";
import AssetPicker from "./AssetPicker";
import {
  CMS_TOKEN_KEY,
  DEFAULT_CONTENT,
  SECTIONS,
  characterMap,
  clearElementOverride,
  getElementOverride,
  getByPath,
  getSectionFields,
  listContentFields,
  loadContent,
  loadContentFromApi,
  resolveContent,
  saveContent,
  saveContentToApi,
  setElementOverride,
  setByPath,
  uploadAssetToApi,
} from "../../lib/siteContent";

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
  const fields = useMemo(() => getSectionFields(activeSection, content), [activeSection, content]);
  const allFields = useMemo(() => listContentFields(content), [content]);
  const textFields = fields.filter((field) => field.type === "text");
  const assetFields = fields.filter((field) => field.type === "asset");
  const chars = useMemo(() => characterMap(content), [content]);
  const selectedField = allFields.find((field) => field.path === selectedPath);
  const selectedOverride = selectedPath ? getElementOverride(content, selectedPath) : {};

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

  const updateField = (path, value) => {
    setContent((current) => {
      const next = setByPath(current, path, value);
      setJsonDraft(JSON.stringify(next, null, 2));
      return next;
    });
  };

  const selectElement = (path) => {
    setSelectedPath(path);
    const sectionId = path.split(".")[0];
    if (SECTIONS.some((section) => section.id === sectionId)) {
      setActiveSection(sectionId);
    }
  };

  const updateElementDesign = (path, patch) => {
    if (!path) return;
    setContent((current) => {
      const next = setElementOverride(current, path, patch);
      setJsonDraft(JSON.stringify(next, null, 2));
      return next;
    });
  };

  const resetElementDesign = () => {
    if (!selectedPath) return;
    setContent((current) => {
      const next = clearElementOverride(current, selectedPath);
      setJsonDraft(JSON.stringify(next, null, 2));
      return next;
    });
  };

  const updateSelectedNumber = (key, value) => {
    updateElementDesign(selectedPath, { [key]: value === "" ? "" : Number(value) });
  };

  const updateSelectedText = (key, value) => {
    updateElementDesign(selectedPath, { [key]: value });
  };

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
      setContent(remoteContent);
      setJsonDraft(JSON.stringify(remoteContent, null, 2));
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
      setContent(saved);
      setJsonDraft(JSON.stringify(saved, null, 2));
      setStatus("Saved to Supabase. Vercel live site will read this content.");
    } catch (error) {
      setStatus(`Remote save failed: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    const next = resolveContent(DEFAULT_CONTENT);
    setContent(next);
    saveContent(next);
    setJsonDraft(JSON.stringify(next, null, 2));
    setStatus("Reset to default draft. Click Save to publish this reset to Supabase.");
  };

  const handleImport = () => {
    try {
      const next = resolveContent(JSON.parse(jsonDraft));
      setContent(next);
      saveContent(next);
      setJsonDraft(JSON.stringify(next, null, 2));
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
      <aside className="cms-sidebar">
        <div className="cms-brand">
          <strong>Nirav CMS</strong>
          <span>Every section + every character mapped</span>
        </div>

        <div className="cms-panel-group cms-auth">
          <h3>Supabase Publish</h3>
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
            <button type="button" onClick={handleUnlock}>Unlock</button>
            <button type="button" onClick={handleLoadRemote}>Reload Remote</button>
          </div>
        </div>

        <div className="cms-panel-group">
          <h3>Sections</h3>
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

        <div className="cms-panel-group cms-style-panel">
          <h3>Selected Element</h3>
          {selectedField ? (
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
                <label>
                  <span>X</span>
                  <input type="number" value={selectedOverride.x ?? ""} onChange={(event) => updateSelectedNumber("x", event.target.value)} />
                </label>
                <label>
                  <span>Y</span>
                  <input type="number" value={selectedOverride.y ?? ""} onChange={(event) => updateSelectedNumber("y", event.target.value)} />
                </label>
                <label>
                  <span>W</span>
                  <input type="number" value={selectedOverride.w ?? ""} onChange={(event) => updateSelectedNumber("w", event.target.value)} />
                </label>
                <label>
                  <span>H</span>
                  <input type="number" value={selectedOverride.h ?? ""} onChange={(event) => updateSelectedNumber("h", event.target.value)} />
                </label>
                <label>
                  <span>Font</span>
                  <input
                    type="number"
                    value={selectedOverride.fontSize ?? ""}
                    onChange={(event) => updateSelectedNumber("fontSize", event.target.value)}
                  />
                </label>
                <label>
                  <span>Z</span>
                  <input type="number" value={selectedOverride.zIndex ?? ""} onChange={(event) => updateSelectedNumber("zIndex", event.target.value)} />
                </label>
                <label>
                  <span>Radius</span>
                  <input type="number" value={selectedOverride.radius ?? ""} onChange={(event) => updateSelectedNumber("radius", event.target.value)} />
                </label>
                <label>
                  <span>Pad</span>
                  <input type="number" value={selectedOverride.padding ?? ""} onChange={(event) => updateSelectedNumber("padding", event.target.value)} />
                </label>
                <label>
                  <span>Color</span>
                  <input value={selectedOverride.color ?? ""} placeholder="#ffffff" onChange={(event) => updateSelectedText("color", event.target.value)} />
                </label>
                <label>
                  <span>BG</span>
                  <input
                    value={selectedOverride.background ?? ""}
                    placeholder="transparent"
                    onChange={(event) => updateSelectedText("background", event.target.value)}
                  />
                </label>
                <label>
                  <span>Opacity</span>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.05"
                    value={selectedOverride.opacity ?? ""}
                    onChange={(event) => updateSelectedNumber("opacity", event.target.value)}
                  />
                </label>
                <label>
                  <span>Fit</span>
                  <select value={selectedOverride.objectFit ?? ""} onChange={(event) => updateSelectedText("objectFit", event.target.value)}>
                    <option value="">auto</option>
                    <option value="cover">cover</option>
                    <option value="contain">contain</option>
                    <option value="fill">fill</option>
                  </select>
                </label>
              </div>
              <button type="button" onClick={resetElementDesign}>Reset Selected Style</button>
            </>
          ) : (
            <p className="cms-muted">Click any mapped text or image on the canvas.</p>
          )}
        </div>

        <div className="cms-panel-group">
          <h3>Layers</h3>
          <div className="cms-layer-list">
            {fields.map((field) => (
              <button
                key={field.path}
                type="button"
                className={selectedPath === field.path ? "is-active" : ""}
                onClick={() => selectElement(field.path)}
              >
                <span>{field.type}</span>
                {field.path}
              </button>
            ))}
          </div>
        </div>

        <div className="cms-panel-group">
          <h3>Text Fields</h3>
          {textFields.map((field) => (
            <label key={field.path} className="cms-field">
              <span>{field.path}</span>
              <textarea value={String(getByPath(content, field.path) || "")} onChange={(event) => updateField(field.path, event.target.value)} />
            </label>
          ))}
        </div>

        <AssetPicker
          fields={assetFields}
          content={content}
          getValue={getByPath}
          onChange={updateField}
          onUpload={handleAssetUpload}
          uploadingPath={uploadingPath}
        />

        <div className="cms-panel-group">
          <h3>Character Map</h3>
          <p className="cms-muted">{chars.length} editable characters mapped across the site.</p>
          <div className="cms-char-map">
            {chars.map((item) => (
              <span key={item.key} title={`${item.path} [${item.index}] U+${item.code.toString(16).toUpperCase()}`}>
                {item.char === " " ? "·" : item.char}
              </span>
            ))}
          </div>
        </div>

        <div className="cms-actions">
          <button type="button" onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : "Save to Supabase"}</button>
          <button type="button" onClick={handleReset}>Reset</button>
          <a href="/preview" target="_blank" rel="noreferrer">Preview</a>
          <a href="/" target="_blank" rel="noreferrer">Live</a>
        </div>

        <div className="cms-panel-group">
          <h3>JSON Export / Import</h3>
          <textarea className="cms-json" value={jsonDraft} onChange={(event) => setJsonDraft(event.target.value)} />
          <button type="button" onClick={handleImport}>Apply JSON</button>
        </div>
      </aside>

      <section className="cms-canvas">
        <div className="cms-canvas-toolbar">
          <span>Canvas editor</span>
          <strong>{activeSection}</strong>
        </div>
        <LandingSections
          content={content}
          editable
          onChange={updateField}
          showCmsButton={false}
          showHeader={false}
          selectedPath={selectedPath}
          onSelect={selectElement}
          onMove={updateElementDesign}
          onResize={updateElementDesign}
        />
      </section>
    </div>
  );
}
