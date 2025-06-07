import React, { useState } from "react";
import { mergeJson } from "../utils/jsonMerger";
import formTypeMapper from "../utils/formTypeMapper";

function detectFormType(inputJson) {
  if (!Array.isArray(inputJson.field_data)) return null;
  const typeField = inputJson.field_data.find(
    (f) => f.name === "opportunity_type"
  );
  return typeField?.values?.[0]?.toLowerCase() ?? null;
}

function JsonMergeForm() {
  const [inputJson, setInputJson] = useState("");
  const [resultJson, setResultJson] = useState("");
  const [detectedFormType, setDetectedFormType] = useState("");

  const handleMerge = async () => {
    try {
      const parsedInput = JSON.parse(inputJson);
      const detectedType = detectFormType(parsedInput);
      const formType = formTypeMapper[detectedType];

      if (!formType) {
        setResultJson(`❌ Unknown opportunity_type: ${detectedType}`);
        return;
      }

      const res = await fetch(`/templates/${formType}.json`);
      const baseJson = await res.json();

      const merged = mergeJson(baseJson, parsedInput);
      setResultJson(JSON.stringify(merged, null, 2));
      setDetectedFormType(formType);
    } catch (err) {
      setResultJson(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>JSON Update Tool</h2>

      {detectedFormType && (
        <div>
          <strong>Detected Form Type:</strong> {detectedFormType}
        </div>
      )}

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
