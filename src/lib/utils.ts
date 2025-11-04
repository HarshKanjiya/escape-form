import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDate(date: Date | null, locale: string = 'en-US'): string {
  if (!date) return '';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(date));
}

export const showToast = (message: string, description?: string, type: 'success' | 'error' | "info" | "warning" = 'success') => {
  toast[type](message, {
    description,
    duration: 3000,
    action: true,
    cancel: true,
    position: 'bottom-right'
  });
}

export const showError = (message: string, description: string = "") => {
  showToast(message, description, 'error');
}

export const showSuccess = (message: string, description: string = "") => {
  showToast(message, description, 'success');
}

export const showInfo = (message: string, description: string = "") => {
  showToast(message, description, 'info');
}

export const showWarning = (message: string, description: string = "") => {
  showToast(message, description, 'warning');
}

export const objToQueryString = (obj: Record<string, any>): string => {
  const params = new URLSearchParams();
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      params.append(key, obj[key]);
    }
  }
  return params.toString();
}
