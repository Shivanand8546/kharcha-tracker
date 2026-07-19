import Tesseract from "tesseract.js";

// Runs OCR on an image file and tries to extract the largest currency-like number
export const extractAmountFromImage = async (imageFile) => {
  const {
    data: { text },
  } = await Tesseract.recognize(imageFile, "eng");

  // Find all number-looking tokens (handles 1,234.50 style too)
  const matches = text.match(/(\d{1,3}(,\d{3})*(\.\d{1,2})?|\d+(\.\d{1,2})?)/g);

  if (!matches || matches.length === 0) {
    return { amount: "", rawText: text };
  }

  // Assume the largest number on the receipt is the total amount
  const numbers = matches
    .map((m) => parseFloat(m.replace(/,/g, "")))
    .filter((n) => !isNaN(n) && n > 0);

  const amount = numbers.length > 0 ? Math.max(...numbers) : "";

  return { amount: amount ? String(amount) : "", rawText: text };
};