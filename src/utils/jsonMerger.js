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
      if (!(key in temp)) return; // Strict mode: exit early
      temp = temp[key];
    }
  }
}

function pathExists(obj, path) {
  const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");
  let temp = obj;

  for (let key of keys) {
    if (!(key in temp)) return false;
    temp = temp[key];
  }

  return true;
}

function getValueFromInput(inputJson, inputKey) {
  if (inputJson[inputKey]) return inputJson[inputKey];

  if (Array.isArray(inputJson.field_data)) {
    const match = inputJson.field_data.find((f) => f.name === inputKey);
    return match?.values?.[0] ?? null;
  }

  return null;
}

export function mergeJson(baseJson, inputJson) {
  const merged = structuredClone(baseJson);

  Object.entries(fieldMapping).forEach(([inputKey, targetPaths]) => {
    const val = getValueFromInput(inputJson, inputKey);
    if (!val) return;

    // Handle multiple fallbacks
    if (Array.isArray(targetPaths)) {
      for (const path of targetPaths) {
        if (pathExists(baseJson, path)) {
          setDeepValue(merged, path, val);
        }
      }
    } else {
      setDeepValue(merged, targetPaths, val);
    }
  });

  return merged;
}
