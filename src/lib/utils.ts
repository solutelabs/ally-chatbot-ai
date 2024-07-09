import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const maxTotalFileSize = 5 * 1024 * 1024;

export const getISTDate = () => {
  const date = new Date();
  const utcOffset = date.getTimezoneOffset(); // returns offset in minutes
  const istOffset = 330; // IST is UTC+5:30 or 330 minutes ahead
  const istDate = new Date(date.getTime() + (istOffset + utcOffset) * 60000);
  return istDate;
};

export function convertTemperature(value: number): number {
  const newValue = (value / 100) * 2;
  return Math.round(newValue * 100) / 100;
}