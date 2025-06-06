// src/components/JsonMergeForm.js
import React, { useState, useEffect } from "react";
import { mergeJson } from "../utils/jsonMerger";

const formTypes = [
  "Callback",
  "QuoteRequest",
  "KeepMeUpdated",
  "ContactRequest",
  "TestDriveRequest",
];

function JsonMergeForm() {
  const [formType, setFormType] = useState("Callback");
  const [inputJson, setInputJson] = useState("");
  const [resultJson, setResultJson] = useState("");

  const handleMerge = async () => {
    try {
      const res = await fetch(`/templates/${formType}.json`);
      const baseJson = await res.json();
      const parsedInput = JSON.parse(inputJson);
      const merged = mergeJson(baseJson, parsedInput);
      setResultJson(JSON.stringify(merged, null, 2));
    } catch (err) {
      setResultJson(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>JSON Merge Tool</h2>
      <label>
        Select Form Type:
        <select value={formType} onChange={(e) => setFormType(e.target.value)}>
          {formTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </label>

      <br />
      <label>
        Paste Input JSON:
        <textarea
          rows={10}
          cols={80}
          value={inputJson}
          onChange={(e) => setInputJson(e.target.value)}
        />
      </label>

      <br />
      <button onClick={handleMerge}>Merge</button>

      <br />
      <label>
        Output JSON:
        <textarea rows={20} cols={80} value={resultJson} readOnly />
      </label>
    </div>
  );
}

export default JsonMergeForm;
