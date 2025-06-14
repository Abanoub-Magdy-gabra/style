/**
 * Currency utilities for Egyptian Pound (EGP) formatting
 */

// Currency configuration
export const CURRENCY = {
  code: 'EGP',
  symbol: 'ج.م',
  name: 'Egyptian Pound',
  locale: 'ar-EG',
  // Current exchange rates would be implemented here in a real app
};

// Egyptian VAT rate (14%)
export const VAT_RATE = 0.14;

// Shipping costs in EGP
export const SHIPPING_COSTS = {
  standard: 150, // ~7.99 USD equivalent in EGP
  express: 300,  // ~15.99 USD equivalent in EGP
  'free-shipping': 0
};

/**
 * Format a number as Egyptian Pounds
 */
export const formatCurrency = (amount: number): string => {
  return `${CURRENCY.symbol} ${amount.toFixed(2)}`;
};

/**
 * Convert prices from USD to EGP (simplified implementation)
 * In a real app, this would use current exchange rates from an API
 */
export const convertToEGP = (usdAmount: number): number => {
  // Using an approximate exchange rate of 1 USD = 30 EGP
  // In a production app, this would use a real-time exchange rate API
  const exchangeRate = 30;
  return usdAmount * exchangeRate;
};
