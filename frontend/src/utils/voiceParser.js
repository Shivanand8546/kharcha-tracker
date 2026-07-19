// Simple keyword-based parser for spoken transaction text
// Example input: "zomato 500 rupees food expense"
export const parseVoiceText = (text) => {
  const lower = text.toLowerCase();

  // Extract amount (first number found)
  const amountMatch = lower.match(/(\d+(\.\d+)?)/);
  const amount = amountMatch ? amountMatch[1] : "";

  // Detect transaction type
  let transactionType = "";
  if (/credit|income|salary|received|earned/.test(lower)) {
    transactionType = "credit";
  } else if (/expense|spent|paid|debit/.test(lower)) {
    transactionType = "expense";
  }

  // Detect category from known list
  const categories = [
    "Groceries",
    "Rent",
    "Salary",
    "Tip",
    "Food",
    "Medical",
    "Utilities",
    "Entertainment",
    "Transportation",
    "Other",
  ];
  let category = "";
  for (const cat of categories) {
    if (lower.includes(cat.toLowerCase())) {
      category = cat;
      break;
    }
  }

  // Title = the text before the amount (best-effort)
  let title = text;
  if (amountMatch) {
    title = text.slice(0, amountMatch.index).trim();
  }
  if (!title) title = text;

  return { title, amount, category, transactionType };
};