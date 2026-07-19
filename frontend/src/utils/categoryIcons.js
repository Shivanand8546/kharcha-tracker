export const categoryIcons = {
  Groceries: "🛒",
  Rent: "🏠",
  Salary: "💼",
  Tip: "💵",
  Food: "🍔",
  Medical: "💊",
  Utilities: "💡",
  Entertainment: "🎬",
  Transportation: "🚗",
  Other: "💰",
};

export const getCategoryIcon = (category) => {
  return categoryIcons[category] || "💰";
};