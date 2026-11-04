import { notFound } from "next/navigation";
import { ShakeBuilder } from "@/components/shake-builder";
import { recipes } from "@/lib/catalog";

export function generateStaticParams() { return recipes.map((recipe) => ({ slug: recipe.slug })); }
export default async function ShakePage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const recipe = recipes.find((item) => item.slug === slug); if (!recipe) notFound(); return <main className="min-h-screen bg-[#FFFDF7]"><section className="border-b border-[#E9E4DB]" style={{ backgroundColor: `${recipe.accent}26` }}><div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14"><p className="text-sm font-bold text-[#796E67]">SIGNATURE SHAKE / {recipe.category}</p><h1 className="mt-3 font-display text-5xl font-extrabold leading-[.9] tracking-[-.05em] text-[#29221F] sm:text-6xl">{recipe.name}</h1><p className="mt-4 max-w-xl text-[#554B46]">{recipe.description} Add any fruits or extras below—the price updates instantly.</p></div></section><div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12"><ShakeBuilder initialRecipe={recipe}/></div></main>; }
