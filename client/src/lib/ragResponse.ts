/**
 * Formats RAG responses from the chatbot.
 * Handles both plain text answers and structured JSON summaries.
 */
function formatRagResponse(data: any): string {
  // 1. Handle string input
  if (typeof data === "string") {
    // Clean up markdown code blocks if present
    const cleanData = data.replace(/```json\n?|```/g, "").trim();

    // Only try to parse if it looks like a JSON summary format (has keyPoints structure)
    if (cleanData.startsWith("{") && cleanData.includes('"keyPoints"')) {
      try {
        const json = JSON.parse(cleanData);
        return formatSummaryJson(json);
      } catch {
        // If parsing fails, return original text
        return data;
      }
    }

    // Return plain text responses as-is
    return data;
  }

  // 2. Handle object input (structured summary)
  if (typeof data === "object" && data !== null) {
    return formatSummaryJson(data);
  }

  // Fallback
  return String(data);
}

/**
 * Formats a structured meeting summary JSON into readable text.
 */
function formatSummaryJson(json: any): string {
  let text = "";

  if (
    json?.keyPoints &&
    Array.isArray(json.keyPoints) &&
    json.keyPoints.length > 0
  ) {
    text += "**Key Points:**\n";
    json.keyPoints.forEach((kp: string, i: number) => {
      text += `${i + 1}. ${kp}\n`;
    });
    text += "\n";
  }

  if (
    json?.decisions &&
    Array.isArray(json.decisions) &&
    json.decisions.length > 0
  ) {
    text += "**Decisions:**\n";
    json.decisions.forEach((d: string, i: number) => {
      text += `${i + 1}. ${d}\n`;
    });
    text += "\n";
  }

  if (
    json?.followUps &&
    Array.isArray(json.followUps) &&
    json.followUps.length > 0
  ) {
    text += "**Follow-Ups:**\n";
    json.followUps.forEach((f: string, i: number) => {
      text += `${i + 1}. ${f}\n`;
    });
    text += "\n";
  }

  if (json?.sentiment) {
    text += `**Sentiment:** ${json.sentiment}\n`;
  }

  // If we found formatted content, return it
  if (text) {
    return text.trim();
  }

  // Fallback: return stringified JSON for unexpected structures
  return JSON.stringify(json, null, 2);
}

export default formatRagResponse;
