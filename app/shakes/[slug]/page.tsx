import { notFound } from "next/navigation";
import { ShakeBuilder } from "@/components/shake-builder";
import { recipes } from "@/lib/catalog";

export function generateStaticParams() { return recipes.map((recipe) => ({ slug: recipe.slug })); }
export default async function ShakePage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const recipe = recipes.find((item) => item.slug === slug); if (!recipe) notFound(); return <main className="bg-[#fffaf1]"><div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14"><p className="text-xs font-black uppercase tracking-[.18em] text-[#8d756b]">Signature shake</p><h1 className="mt-2 font-display text-5xl font-black uppercase leading-none text-[#2f1d16] sm:text-6xl">{recipe.name}</h1><p className="mt-3 max-w-xl text-[#705f57]">{recipe.description} Add fruits or extras below and see the price update right away.</p><div className="mt-8"><ShakeBuilder initialRecipe={recipe}/></div></div></main>; }
