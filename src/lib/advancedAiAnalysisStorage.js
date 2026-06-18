export const ADVANCED_AI_PROGRESS_KEY = "profile:advanced-ai-analysis-progress:v1";
export const ADVANCED_AI_RESULT_KEY = "profile:advanced-ai-analysis-result:v1";

export function readAdvancedAiAnalysisResult() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(ADVANCED_AI_RESULT_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}
