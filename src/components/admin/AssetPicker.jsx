import React from "react";

export default function AssetPicker({ fields, content, onChange, getValue }) {
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
            </label>
          );
        })
      )}
    </div>
  );
}
