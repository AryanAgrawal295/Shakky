import Image from "next/image";
import Link from "next/link";
import type { RecipeDef } from "@/lib/catalog";
import { money } from "@/lib/pricing";

export function ShakeCard({ recipe, index = 0 }: { recipe: RecipeDef; index?: number }) {
  const positions = ["57% center", "96% center", "76% center", "63% center", "50% center", "76% center", "95% center", "57% center"];
  return <article className="overflow-hidden rounded-[1.75rem] border border-[#2f1d16]/10 bg-white shadow-sm"><div className="relative h-56 overflow-hidden"><Image src="/images/shake-hero.png" alt={`${recipe.name} shake`} fill className="object-cover transition duration-500 hover:scale-105" style={{ objectPosition: positions[index % positions.length] }}/><div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"/></div><div className="p-5"><p className="text-xs font-black uppercase tracking-[.16em] text-[#8d756b]">{recipe.category}</p><h2 className="mt-2 font-display text-3xl font-black leading-none text-[#2f1d16]">{recipe.name}</h2><p className="mt-3 min-h-10 text-sm leading-5 text-[#715f58]">{recipe.description}</p><div className="mt-5 flex items-center justify-between"><div><span className="block text-[10px] font-bold uppercase tracking-wider text-[#8d756b]">Starting at</span><b className="font-display text-2xl text-[#2f1d16]">{money(recipe.basePricePaise)}</b></div><Link href={`/shakes/${recipe.slug}`} className="rounded-full bg-[#ef5f87] px-4 py-2 text-sm font-black text-[#2f1d16] hover:bg-[#d9ff63]">Customize</Link></div></div></article>;
}
