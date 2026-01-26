import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toNumber = (value?: string | number | FormDataEntryValue | null) => {
  if (value == null || value == "") return null;
  if (isNaN(Number(value))) throw TypeError(`${value} is not a number.`);
  return Number(value);
};