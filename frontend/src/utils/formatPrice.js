/**
 * Formats a number as a price string in PKR (Rs.)
 * @param {number} amount - The numeric price amount
 * @param {boolean} includeDecimals - Whether to show .00 (default: false for PKR)
 * @returns {string} - Formatted price string (e.g., Rs. 1,500)
 */
export const formatPrice = (amount, includeDecimals = false) => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }

  const formatted = amount.toLocaleString('en-PK', {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  });

  return `Rs. ${formatted}`;
};
