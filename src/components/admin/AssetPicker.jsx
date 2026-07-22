import React from "react";

export default function AssetPicker({ fields, content, onChange, onUpload, getValue, uploadingPath = "" }) {
  return (
    <div className="cms-panel-group">
      <h3>Assets</h3>
      {fields.length === 0 ? (
        <p className="cms-muted">No asset fields in this section.</p>
      ) : (
        fields.map((field) => {
          const value = String(getValue(content, field.path) || "");
          return (
            <label key={field.path} className="cms-field cms-asset-field">
              <span>{field.path}</span>
              {value && <img src={value} alt="" />}
              <input value={value} onChange={(event) => onChange(field.path, event.target.value)} />
              <span className="cms-file-control">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) onUpload(field.path, file);
                    event.target.value = "";
                  }}
                />
                <strong>{uploadingPath === field.path ? "Uploading..." : "Upload image"}</strong>
              </span>
            </label>
          );
        })
      )}
    </div>
  );
}
