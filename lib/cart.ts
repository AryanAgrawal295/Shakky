import type { CartItem } from "@/lib/order-types";

export const CART_STORAGE_KEY = "shake-lab-cart-v1";
export function newCartId() { return globalThis.crypto?.randomUUID?.() ?? `cart-${Date.now()}-${Math.random().toString(36).slice(2)}`; }
export function safeCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is CartItem => !!item && typeof item === "object" && typeof (item as CartItem).id === "string" && Array.isArray((item as CartItem).selections) && Number.isInteger((item as CartItem).quantity) && (item as CartItem).quantity > 0 && (item as CartItem).quantity <= 20);
}
