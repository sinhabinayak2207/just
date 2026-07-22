import React, { useEffect, useMemo, useState } from "react";
import LandingSections from "../landing/LandingSections";
import AssetPicker from "./AssetPicker";
import {
  CMS_TOKEN_KEY,
  DEFAULT_CONTENT,
  SECTIONS,
  characterMap,
  getByPath,
  getSectionFields,
  loadContent,
  loadContentFromApi,
  resolveContent,
  saveContent,
  saveContentToApi,
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
  const fields = useMemo(() => getSectionFields(activeSection, content), [activeSection, content]);
  const textFields = fields.filter((field) => field.type === "text");
  const assetFields = fields.filter((field) => field.type === "asset");
  const chars = useMemo(() => characterMap(content), [content]);

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
        <LandingSections content={content} editable onChange={updateField} showCmsButton={false} />
      </section>
    </div>
  );
}
