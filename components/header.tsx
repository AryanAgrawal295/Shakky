import Link from "next/link";

export function Header() {
  return <header className="sticky top-0 z-50 border-b border-[#2f1d16]/10 bg-[#fffaf1]/90 backdrop-blur"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"><Link href="/" className="font-display text-2xl font-black tracking-tight text-[#2f1d16]">SHAKE LAB</Link><Link href="/build-your-shake" className="rounded-full bg-[#2f1d16] px-4 py-2 text-sm font-bold text-white hover:bg-[#ef5f87]">Build yours</Link></div></header>;
}
