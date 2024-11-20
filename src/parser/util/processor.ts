export const MAX_CURRENCY_PAIRS = 1000;

export function isValidNumber(value: string): boolean {
  return /^\d+(\.\d+)?$/.test(value) && parseFloat(value) > 0;
}

export function isValidWholeNumber(value: string): boolean {
  return /^\d+$/.test(value) && parseInt(value) >= 0;
}

export function isValidCurrency(currency: string): boolean {
  return currency.length === 3 && currency === currency.toUpperCase();
}

export interface ParsedFXQL {
  SourceCurrency: string;
  DestinationCurrency: string;
  BuyPrice: number;
  SellPrice: number;
  CapAmount: number;
}
