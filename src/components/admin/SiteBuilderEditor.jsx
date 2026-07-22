import React, { useMemo, useState } from "react";
import LandingSections from "../landing/LandingSections";
import AssetPicker from "./AssetPicker";
import {
  DEFAULT_CONTENT,
  SECTIONS,
  characterMap,
  getByPath,
  getSectionFields,
  loadContent,
  resolveContent,
  saveContent,
  setByPath,
} from "../../lib/siteContent";

export default function SiteBuilderEditor() {
  const [content, setContent] = useState(() => loadContent());
  const [activeSection, setActiveSection] = useState("hero");
  const [jsonDraft, setJsonDraft] = useState(() => JSON.stringify(loadContent(), null, 2));
  const fields = useMemo(() => getSectionFields(activeSection, content), [activeSection, content]);
  const textFields = fields.filter((field) => field.type === "text");
  const assetFields = fields.filter((field) => field.type === "asset");
  const chars = useMemo(() => characterMap(content), [content]);

  const updateField = (path, value) => {
    setContent((current) => {
      const next = setByPath(current, path, value);
      setJsonDraft(JSON.stringify(next, null, 2));
      return next;
    });
  };

  const handleSave = () => {
    saveContent(content);
    setJsonDraft(JSON.stringify(content, null, 2));
  };

  const handleReset = () => {
    const next = resolveContent(DEFAULT_CONTENT);
    setContent(next);
    saveContent(next);
    setJsonDraft(JSON.stringify(next, null, 2));
  };

  const handleImport = () => {
    const next = resolveContent(JSON.parse(jsonDraft));
    setContent(next);
    saveContent(next);
    setJsonDraft(JSON.stringify(next, null, 2));
  };

  return (
    <div className="cms-builder">
      <aside className="cms-sidebar">
        <div className="cms-brand">
          <strong>Nirav CMS</strong>
          <span>Every section + every character mapped</span>
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

        <AssetPicker fields={assetFields} content={content} getValue={getByPath} onChange={updateField} />

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
          <button type="button" onClick={handleSave}>Save Draft</button>
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
