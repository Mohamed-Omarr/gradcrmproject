import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function IsCustomerAuthed() {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("AccessToken");
  }
  return false;
}


