"use client";

import { Check, RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { ingredients, type RecipeDef } from "@/lib/catalog";
import { money, nutritionEstimate, priceShake, type Selection } from "@/lib/pricing";

type BaseId = "milk" | "low-fat-milk" | "water";
type WheyAmount = 0 | 15 | 30 | 45;
type FlavourId = "none" | "cocoa" | "vanilla" | "coffee";

const bases: { id: BaseId; title: string; detail: string; badge: string; color: string; imagePosition: string }[] = [
  { id: "milk", title: "Regular milk", detail: "Creamy & classic", badge: "M", color: "bg-[#fff2bd]", imagePosition: "0% 0%" },
  { id: "low-fat-milk", title: "Low-fat milk", detail: "Light but creamy", badge: "LF", color: "bg-[#dff5ff]", imagePosition: "33.333% 0%" },
  { id: "water", title: "Chilled water", detail: "Light & fresh", badge: "W", color: "bg-[#dff8ed]", imagePosition: "66.667% 0%" },
];
const wheyChoices: { value: WheyAmount; title: string; detail: string; color: string }[] = [
  { value: 0, title: "No whey", detail: "Keep it simple", color: "bg-[#f3eaff]" },
  { value: 15, title: "Half scoop", detail: "15g protein", color: "bg-[#e9ddff]" },
  { value: 30, title: "1 scoop", detail: "30g protein", color: "bg-[#d9c6ff]" },
  { value: 45, title: "1½ scoops", detail: "45g protein", color: "bg-[#c6a7ff]" },
];
const flavours: { id: FlavourId; title: string; detail: string; badge: string; color: string; imagePosition: string }[] = [
  { id: "none", title: "No flavour", detail: "Natural taste", badge: "—", color: "bg-[#f1eee7]", imagePosition: "100% 100%" },
  { id: "cocoa", title: "Chocolate", detail: "Rich cocoa", badge: "C", color: "bg-[#edc4a5]", imagePosition: "0% 100%" },
  { id: "vanilla", title: "Vanilla", detail: "Sweet & smooth", badge: "V", color: "bg-[#fff1ae]", imagePosition: "33.333% 100%" },
  { id: "coffee", title: "Coffee", detail: "A little kick", badge: "CF", color: "bg-[#d9bd9d]", imagePosition: "66.667% 100%" },
];
const fruits = [
  { id: "banana", title: "Banana", detail: "100g", imagePosition: "0% 0%", color: "bg-[#f9ec72]" },
  { id: "apple", title: "Apple", detail: "100g", imagePosition: "33.333% 0%", color: "bg-[#c9ef98]" },
  { id: "strawberry", title: "Strawberry", detail: "60g", imagePosition: "66.667% 0%", color: "bg-[#ffc7d5]" },
  { id: "blueberry", title: "Blueberry", detail: "60g", imagePosition: "100% 0%", color: "bg-[#c9ccff]" },
] as const;
const addOns = [
  { id: "peanut-butter", title: "Peanut butter", detail: "20g", imagePosition: "0% 100%", color: "bg-[#ffc88c]" },
  { id: "oats", title: "Oats", detail: "30g", imagePosition: "33.333% 100%", color: "bg-[#dfd5bb]" },
  { id: "dry-fruits", title: "Dry fruits", detail: "20g", imagePosition: "66.667% 100%", color: "bg-[#f6d29d]" },
  { id: "seeds", title: "Seeds", detail: "15g", imagePosition: "100% 100%", color: "bg-[#cde9c0]" },
] as const;
const portions: Record<string, number> = { milk: 250, "low-fat-milk": 250, water: 250, cocoa: 8, vanilla: 3, coffee: 3, banana: 100, apple: 100, strawberry: 60, blueberry: 60, "peanut-butter": 20, oats: 30, "dry-fruits": 20, seeds: 15 };

function initialValues(recipe?: RecipeDef) {
  const defaults = recipe?.defaults ?? {};
  const base = (["milk", "low-fat-milk", "water"] as BaseId[]).find((id) => defaults[id]) ?? "milk";
  const wheyAmount = defaults.whey ?? 0;
  const whey: WheyAmount = wheyAmount >= 45 ? 45 : wheyAmount >= 30 ? 30 : wheyAmount >= 15 ? 15 : 0;
  const flavour = (["cocoa", "vanilla", "coffee"] as FlavourId[]).find((id) => defaults[id]) ?? "none";
  const extras = [...fruits, ...addOns].filter((choice) => defaults[choice.id]).map((choice) => choice.id);
  return { base, whey, flavour, extras };
}

export function ShakeBuilder({ initialRecipe }: { initialRecipe?: RecipeDef }) {
  const initial = initialValues(initialRecipe);
  const [base, setBase] = useState<BaseId>(initial.base);
  const [whey, setWhey] = useState<WheyAmount>(initial.whey);
  const [flavour, setFlavour] = useState<FlavourId>(initial.flavour);
  const [addons, setAddons] = useState<string[]>(initial.extras);
  const selections = useMemo<Selection[]>(() => [
    { ingredientId: base, quantity: portions[base] },
    ...(whey ? [{ ingredientId: "whey", quantity: whey }] : []),
    ...(flavour !== "none" ? [{ ingredientId: flavour, quantity: portions[flavour] }] : []),
    ...addons.map((ingredientId) => ({ ingredientId, quantity: portions[ingredientId] })),
  ], [addons, base, flavour, whey]);
  const quote = useMemo(() => priceShake(initialRecipe ?? null, selections, ingredients), [initialRecipe, selections]);
  const nutrition = useMemo(() => nutritionEstimate(selections, ingredients), [selections]);
  const selectedNames = quote.lines.map((line) => line.name).join(" · ");
  const reset = () => { setBase(initial.base); setWhey(initial.whey); setFlavour(initial.flavour); setAddons(initial.extras); };

  return <section className="relative grid items-start gap-5 pb-24 lg:grid-cols-[minmax(0,1fr)_340px] lg:pb-0">
    <div className="space-y-4">
      <ChoiceSection number="1" title="Choose your base" subtitle="Pick one to start." tone="bg-[#fff8dc]">
        <div className="grid gap-3 sm:grid-cols-3">{bases.map((choice) => <Option key={choice.id} active={base === choice.id} onClick={() => setBase(choice.id)} color={choice.color}><IngredientImage position={choice.imagePosition} sheet="bases"/><Copy title={choice.title} detail={choice.detail} /></Option>)}</div>
      </ChoiceSection>
      <ChoiceSection number="2" title="Add whey protein" subtitle="Choose a serving size." tone="bg-[#f5edff]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{wheyChoices.map((choice) => <Option key={choice.value} active={whey === choice.value} onClick={() => setWhey(choice.value)} color={choice.color} centered>{choice.value !== 0 && <IngredientImage position="100% 0%" sheet="bases"/>}<Copy title={choice.title} detail={choice.detail} /></Option>)}</div>
      </ChoiceSection>
      <ChoiceSection number="3" title="Pick a flavour" subtitle="One is enough." tone="bg-[#fff0e5]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{flavours.map((choice) => <Option key={choice.id} active={flavour === choice.id} onClick={() => setFlavour(choice.id)} color={choice.color}><IngredientImage position={choice.imagePosition} sheet="bases"/><Copy title={choice.title} detail={choice.detail} /></Option>)}</div>
      </ChoiceSection>
      <ChoiceSection number="4" title="Pick your fruits" subtitle="Choose as many fruits as you like." tone="bg-[#fff0f4]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{fruits.map((choice) => <Option key={choice.id} active={addons.includes(choice.id)} onClick={() => setAddons((items) => items.includes(choice.id) ? items.filter((id) => id !== choice.id) : [...items, choice.id])} color={choice.color}><IngredientImage position={choice.imagePosition}/><Copy title={choice.title} detail={choice.detail} /></Option>)}</div>
      </ChoiceSection>
      <ChoiceSection number="5" title="Add your extras" subtitle="Choose as many add-ons as you like." tone="bg-[#eef9e8]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{addOns.map((choice) => <Option key={choice.id} active={addons.includes(choice.id)} onClick={() => setAddons((items) => items.includes(choice.id) ? items.filter((id) => id !== choice.id) : [...items, choice.id])} color={choice.color}><IngredientImage position={choice.imagePosition}/><Copy title={choice.title} detail={choice.detail} /></Option>)}</div>
      </ChoiceSection>
    </div>
    <aside className="overflow-hidden rounded-[2rem] bg-[#2f1d16] text-white shadow-[0_20px_60px_rgba(76,38,27,.22)] lg:sticky lg:top-6">
      <div className="bg-[#ef5f87] px-6 py-5 text-[#2f1d16]"><Sparkles size={22}/><p className="mt-3 text-xs font-black uppercase tracking-[0.17em]">Your custom shake</p><p className="mt-1 text-sm font-semibold leading-5 opacity-75">{selectedNames}</p></div>
      <div className="p-6"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#d9ff63]">Your price</p><p className="mt-2 font-display text-6xl font-black leading-none">{money(quote.sellingPricePaise)}</p><p className="mt-3 text-sm text-white/65">Includes every choice above.</p><div className="mt-6 border-y border-white/15 py-4 text-center"><b className="font-display text-2xl">{Math.round(nutrition.protein)}g</b><span className="block text-[10px] font-bold uppercase tracking-wider text-white/55">Protein</span></div><button type="button" onClick={reset} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-white/75 transition hover:text-white"><RotateCcw size={16}/>Start again</button></div>
    </aside>
    <div className="fixed inset-x-3 bottom-3 z-40 rounded-2xl bg-[#2f1d16] p-3 text-white shadow-2xl lg:hidden"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#d9ff63]">Your shake price</p><p className="font-display text-3xl font-black leading-none">{money(quote.sellingPricePaise)}</p></div><span className="rounded-xl bg-[#ef5f87] px-3 py-2 text-xs font-black text-[#2f1d16]">Live total</span></div></div>
  </section>;
}

function ChoiceSection({ number, title, subtitle, children, tone }: { number: string; title: string; subtitle: string; children: React.ReactNode; tone: string }) {
  return <section className={`rounded-[1.75rem] border border-[#2f1d16]/10 p-4 shadow-sm sm:p-6 ${tone}`}><div className="mb-5 flex items-start gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#2f1d16] text-sm font-black text-[#d9ff63]">{number}</span><div><h2 className="font-display text-2xl font-black leading-none text-[#2f1d16]">{title}</h2><p className="mt-1 text-sm text-[#75635c]">{subtitle}</p></div></div>{children}</section>;
}
function Option({ active, onClick, color, children, centered = false }: { active: boolean; onClick: () => void; color: string; children: React.ReactNode; centered?: boolean }) {
  return <button type="button" aria-pressed={active} onClick={onClick} className={`relative flex min-h-[112px] w-full gap-3 rounded-2xl border-2 p-4 text-left transition duration-150 active:scale-[.98] ${centered ? "flex-col justify-center text-center" : "items-center"} ${active ? `border-[#2f1d16] ${color} shadow-[3px_4px_0_#2f1d16]` : `${color} border-[#2f1d16]/10 hover:-translate-y-0.5 hover:border-[#2f1d16]/35`}`}>{children}{active && <span className="absolute right-2.5 top-2.5 grid size-6 place-items-center rounded-full bg-[#2f1d16] text-white"><Check size={14} strokeWidth={3}/></span>}</button>;
}
function IngredientImage({ position, sheet = "ingredients" }: { position: string; sheet?: "ingredients" | "bases" }) { return <span aria-hidden="true" className="size-12 shrink-0 rounded-xl bg-cover shadow-sm" style={{ backgroundImage: `url('/images/${sheet === "bases" ? "bases-and-flavours-grid" : "ingredients-grid"}.png')`, backgroundSize: "400% 200%", backgroundPosition: position }} />; }
function Copy({ title, detail }: { title: string; detail: string }) { return <span className="min-w-0"><b className="block text-[15px] leading-5 text-[#2f1d16]">{title}</b><small className="mt-1 block text-xs leading-4 text-[#715f58]">{detail}</small></span>; }
