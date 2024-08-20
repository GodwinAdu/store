import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return function (this: any, ...args: Parameters<T>): void { // Explicitly type 'this' as 'any'
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}


export const findPrice = (prices: { name: string, price: number }[], unit: string) => {
  const priceObj = prices?.find((price) => price.name === unit);
  return priceObj ? priceObj.price : 0;
};

export const calculateQuantity = (prices: { quantityPerUnit: number, stock: number }[]) => {
  // Iterate over each item to calculate total quantity per item
  const quantities = prices.map(price => price.quantityPerUnit * price.stock);

  // Calculate the final total quantity by summing up all the individual quantities
  const totalQuantity = quantities.reduce((acc, quantity) => acc + quantity, 0);

  return totalQuantity; 
};





