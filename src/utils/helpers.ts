import { Gift, Person } from '../types';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const isValidUrl = (url: string): boolean => {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const calculateTotalCost = (gifts: Gift[]): number => {
  return gifts.reduce((sum, gift) => sum + gift.price, 0);
};

export const calculateTotalSpent = (gifts: Gift[]): number => {
  return gifts.filter(gift => gift.purchased).reduce((sum, gift) => sum + gift.price, 0);
};

export const getBudgetStatus = (person: Person): 'under' | 'over' | 'none' => {
  if (!person.budget || person.budget === 0) return 'none';
  const totalCost = calculateTotalCost(person.gifts);
  return totalCost <= person.budget ? 'under' : 'over';
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
