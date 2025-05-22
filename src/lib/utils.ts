import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTenantUrl(slug: string) {
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  return `${protocol}://${slug}.${domain}`;
}

export function formatCurrency(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
}
