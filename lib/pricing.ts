import type { CatalogIngredient, RecipeDef } from "./catalog";

export type Selection = { ingredientId:string; quantity:number };
export function ingredientCostPaise(ingredient: Pick<CatalogIngredient,"costPaisePerUnit"|"min"|"max"|"step"|"unit">, quantity:number) {
  if (!Number.isFinite(quantity) || quantity < 0) throw new Error("Quantity must be zero or greater");
  if (quantity === 0) return 0;
  if (quantity < ingredient.min || quantity > ingredient.max) throw new Error(`Quantity must be between ${ingredient.min} and ${ingredient.max}`);
  const steps = (quantity - ingredient.min) / ingredient.step;
  if (Math.abs(steps - Math.round(steps)) > 1e-8) throw new Error(`Quantity must use steps of ${ingredient.step}`);
  return Math.round(quantity * ingredient.costPaisePerUnit);
}

export function priceShake(recipe: RecipeDef | null, selections: Selection[], catalog: CatalogIngredient[]) {
  const seen = new Set<string>();
  let rawCostPaise = 0;
  let extrasPaise = 0;
  const lines = selections.filter(s => s.quantity > 0).map(selection => {
    if (seen.has(selection.ingredientId)) throw new Error("Duplicate ingredient");
    seen.add(selection.ingredientId);
    const ingredient = catalog.find(i => i.id === selection.ingredientId);
    if (!ingredient || !ingredient.available) throw new Error("Ingredient unavailable");
    const costPaise = ingredientCostPaise(ingredient, selection.quantity);
    rawCostPaise += costPaise;
    const included = recipe?.defaults[ingredient.id] ?? 0;
    extrasPaise += Math.max(0, Math.round((selection.quantity - included) * ingredient.costPaisePerUnit));
    return { ...selection, name:ingredient.name, unit:ingredient.unit, costPaise, allergens:ingredient.allergens };
  });
  const baseLine = lines.find(l => catalog.find(i => i.id === l.ingredientId)?.category === "BASE");
  const hasBase = Boolean(baseLine);
  // Each liquid has a simple fixed starting price; every selected non-base ingredient is added at its configured portion cost.
  const baseCharges: Record<string, number> = { milk: 2000, "low-fat-milk": 2000, water: 2000 };
  const baseChargePaise = baseLine ? (baseCharges[baseLine.ingredientId] ?? baseLine.costPaise) : 2000;
  const sellingPricePaise = recipe ? recipe.basePricePaise + extrasPaise : baseChargePaise + (rawCostPaise - (baseLine?.costPaise ?? 0));
  return { lines, rawCostPaise, extrasPaise, sellingPricePaise, valid:hasBase, error:hasBase ? null : "Choose a liquid base" };
}

export function nutritionEstimate(selections:Selection[], catalog:CatalogIngredient[]) {
  let complete = true;
  const total = { calories:0,protein:0,carbs:0,sugars:0,fat:0,fibre:0 };
  for (const s of selections) {
    const i = catalog.find(x => x.id === s.ingredientId);
    if (!i?.nutrition) { complete = false; continue; }
    for (const key of Object.keys(total) as (keyof typeof total)[]) total[key] += i.nutrition[key] * s.quantity / 100;
  }
  return { ...Object.fromEntries(Object.entries(total).map(([k,v])=>[k,Math.round(v*10)/10])) as typeof total, complete };
}

export const money = (paise:number) => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",minimumFractionDigits:0,maximumFractionDigits:2}).format(paise/100);
