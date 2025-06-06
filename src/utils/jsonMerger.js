// src/utils/jsonMerger.js
import fieldMapping from "./fieldMapping";

function setDeepValue(obj, path, value) {
  const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");
  let temp = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (i === keys.length - 1) {
      temp[key] = value;
    } else {
      if (!(key in temp)) return; // ❌ Exit if path doesn’t exist in base
      temp = temp[key];
    }
  }
}

export function mergeJson(baseJson, inputJson) {
  const merged = { ...structuredClone(baseJson) };

  Object.entries(fieldMapping).forEach(([inputKey, targetPath]) => {
    const val = getValueFromInput(inputJson, inputKey);
    if (val) {
      setDeepValue(merged, targetPath, val);
    }
  });

  /// ✅ Only add "market" if it exists in the base template
  if ("market" in baseJson && merged.countryCode) {
    merged.market = merged.countryCode;
  }

  if ("language" in baseJson && merged.languageCode) {
    merged.language = merged.languageCode;
  }

  return merged;
}

function getValueFromInput(inputJson, key) {
  if (inputJson[key]) return inputJson[key];

  if (Array.isArray(inputJson.field_data)) {
    const match = inputJson.field_data.find((f) => f.name === key);
    return match?.values?.[0] ?? null;
  }

  return null;
}
