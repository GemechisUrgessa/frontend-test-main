export function mergeChunkData(dataLines: string[]): string {
  // For "16", ":", "30", "," => "16:30,"
  // For "Hello", "world!" => "Hello world!"
  let result = "";
  for (const line of dataLines) {
    const trimmed = line.replace(/\s+$/, ""); // remove trailing spaces only
    if (!result) {
      result = trimmed;
    } else if (
      // If result ends with punctuation or space, just append
      /[.,!:? ]$/.test(result) ||
      // or this chunk starts with punctuation or space
      /^[.,!:? ]/.test(trimmed)
    ) {
      result += trimmed;
    } else {
      result += " " + trimmed;
    }
  }
  return result;
}