import { recipes } from "@/lib/catalog";
import { ShakeCard } from "@/components/shake-card";
export const metadata = { title: "Signature Menu" };
export default function MenuPage() { return <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6"><p className="text-xs font-black uppercase tracking-[.18em] text-[#8d756b]">Shake Lab menu</p><h1 className="mt-2 font-display text-6xl font-black uppercase leading-none text-[#2f1d16]">Signature shakes</h1><p className="mt-4 max-w-xl text-[#705f57]">Start with a favourite and add any fruits or extras. Your price changes instantly.</p><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{recipes.map((recipe) => <ShakeCard key={recipe.id} recipe={recipe}/>)}</div></main>; }
