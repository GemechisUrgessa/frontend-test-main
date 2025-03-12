export function appendWithSmartSpacing(currentText: string, newText: string): string {
  if (!currentText) return newText;
  if (/[.,!:? ]$/.test(currentText)) {
    return currentText + newText;
  } else {
    return currentText + " " + newText;
  }
}