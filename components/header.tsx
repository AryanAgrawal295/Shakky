"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-provider";

export function Header() {
  const { items } = useCart(); const count=items.reduce((sum,item)=>sum+item.quantity,0);
  return <header className="sticky top-0 z-50 border-b border-[#E9E4DB] bg-[#FFFDF7]/90 backdrop-blur"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"><Link href="/" className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight text-[#29221F]"><span className="grid size-7 place-items-center rounded-lg bg-[#C9F45B] text-sm">S</span>SHAKE LAB</Link><nav className="hidden items-center gap-6 text-sm font-bold text-[#554B46] md:flex"><Link href="/menu" className="hover:text-[#FF668C]">Menu</Link><Link href="/build-your-shake" className="hover:text-[#FF668C]">Build your shake</Link><Link href="/#how-it-works" className="hover:text-[#FF668C]">How it works</Link></nav><div className="flex items-center gap-2"><Link href="/cart" className="relative grid size-10 place-items-center rounded-full border border-[#29221F]/15 text-[#29221F]" aria-label="Cart"><ShoppingBag size={18}/>{count>0&&<span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-[#FF668C] text-[10px] font-black text-white">{count}</span>}</Link><Link href="/build-your-shake" className="rounded-full bg-[#C9F45B] px-4 py-2 text-sm font-extrabold text-[#29221F] transition hover:-translate-y-0.5 hover:bg-[#b9e84f]">Build yours</Link></div></div></header>;
}
