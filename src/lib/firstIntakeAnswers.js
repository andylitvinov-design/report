export function composeHybridAnswer(selectedTags = [], freeText = "") {
  const tags = selectedTags.filter(Boolean);
  const text = String(freeText || "").trim();

  if (tags.length > 0 && text) {
    return `${tags.join(", ")}.\nКомментарий: ${text}`;
  }

  if (tags.length > 0) {
    return `${tags.join(", ")}.`;
  }

  return text;
}

export function createHybridAnswer(selectedTags = [], freeText = "") {
  const tags = selectedTags.filter(Boolean).slice(0, 3);
  const text = String(freeText || "").trim();
  const composedAnswer = composeHybridAnswer(tags, text);

  return {
    selectedTags: tags,
    freeText: text,
    value: composedAnswer,
    composedAnswer,
  };
}

export function isHybridAnswer(value) {
  return Boolean(value && typeof value === "object" && Array.isArray(value.selectedTags));
}

export function getAnswerText(value) {
  if (value === undefined || value === null) return "";
  if (isHybridAnswer(value)) {
    return value.composedAnswer || value.value || composeHybridAnswer(value.selectedTags, value.freeText);
  }
  return String(value);
}

export function getAnswerFreeText(value) {
  if (isHybridAnswer(value)) return value.freeText || "";
  if (value === undefined || value === null) return "";
  return String(value);
}

export function getAnswerTags(value) {
  if (!isHybridAnswer(value)) return [];
  return value.selectedTags || [];
}

export function hasAnswerContent(value) {
  return getAnswerText(value).trim() !== "";
}
