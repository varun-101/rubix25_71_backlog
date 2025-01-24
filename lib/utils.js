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

export function formatPrice(price) {
  if (price >= 100000) {
    const lakhs = price / 100000;
    const formattedLakhs = Number.isInteger(lakhs) ? lakhs.toString() : lakhs.toFixed(1);
    return `₹${formattedLakhs}L`;
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', 
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}


// calculate distance between two points
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getCategoryIcon(category) {
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes('shop') || categoryLower.includes('store')) {
    return <Store className="h-5 w-5 text-blue-500" />;
  }
  if (categoryLower.includes('mall')) {
    return <ShoppingBag className="h-5 w-5 text-purple-500" />;
  }
  if (categoryLower.includes('restaurant') || categoryLower.includes('food')) {
    return <Utensils className="h-5 w-5 text-orange-500" />;
  }
  if (categoryLower.includes('transport') || categoryLower.includes('station')) {
    return <Car className="h-5 w-5 text-green-500" />;
  }
  return <Building2 className="h-5 w-5 text-gray-500" />;
}
