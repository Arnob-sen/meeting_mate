function formatRagResponse(data: any): string {
  let json = data;

  // 1. Handle string input (try to parse JSON)
  if (typeof data === "string") {
    try {
      // Remove markdown code blocks if present
      const cleanData = data.replace(/```json\n?|```/g, "").trim();
      json = JSON.parse(cleanData);
    } catch {
      // If parsing fails, return the original string (it might be a normal text response)
      return data;
    }
  }

  // 2. Format JSON structure if valid
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

  // If we found formatted content, return it. Otherwise, return the original (or parsed) object as string if it wasn't the expected structure
  if (text) {
    return text.trim();
  }

  // Fallback: If it was JSON but different structure, return it stringified or original string
  return typeof data === "string" ? data : JSON.stringify(data, null, 2);
}

export default formatRagResponse;
