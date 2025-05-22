import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTenantUrl(slug: string) {
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  
  if (!!process.env.NEXT_PUBLIC_ENABLE_SUBDOMAIN) {
    return `${protocol}://${slug}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  }

  return `${protocol}://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/tenants/${slug}`;
}

export function formatCurrency(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
}
