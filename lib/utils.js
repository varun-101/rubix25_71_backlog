import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date){
    return new Date(date).toLocaleDateString('en-IN',{
      month: 'long',
      year:'numeric',
      day:'numeric'
    })
  }

export function formatPrice(price){
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}
