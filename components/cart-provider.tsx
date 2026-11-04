"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CART_STORAGE_KEY, safeCart } from "@/lib/cart";
import type { CartItem } from "@/lib/order-types";

type CartContextValue = { items: CartItem[]; hydrated: boolean; add: (item: CartItem) => void; update: (id: string, patch: Partial<CartItem>) => void; remove: (id: string) => void; clear: () => void; };
const CartContext = createContext<CartContextValue | null>(null);
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]); const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { setItems(safeCart(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "[]"))); } catch {} setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items)); }, [items, hydrated]);
  const value = useMemo(() => ({ items, hydrated, add: (item: CartItem) => setItems((all) => [...all, item]), update: (id: string, patch: Partial<CartItem>) => setItems((all) => all.map((item) => item.id === id ? { ...item, ...patch } : item)), remove: (id: string) => setItems((all) => all.filter((item) => item.id !== id)), clear: () => setItems([]) }), [items, hydrated]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() { const cart = useContext(CartContext); if (!cart) throw new Error("CartProvider is missing"); return cart; }
