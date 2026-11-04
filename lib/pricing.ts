import type { CatalogIngredient, RecipeDef } from "./catalog";

export type Selection = { ingredientId:string; quantity:number };
export const blendAndCupFeePaise = 2000;

export function ingredientCostPaise(ingredient: Pick<CatalogIngredient,"costPaisePerUnit"|"min"|"max"|"step"|"unit">, quantity:number) {
  if (!Number.isFinite(quantity) || quantity < 0) throw new Error("Quantity must be zero or greater");
  if (quantity === 0) return 0;
  if (quantity < ingredient.min || quantity > ingredient.max) throw new Error(`Quantity must be between ${ingredient.min} and ${ingredient.max}`);
  const steps = (quantity - ingredient.min) / ingredient.step;
  if (Math.abs(steps - Math.round(steps)) > 1e-8) throw new Error(`Quantity must use steps of ${ingredient.step}`);
  return Math.round(quantity * ingredient.costPaisePerUnit);
}
export function ingredientCustomerChargePaise(ingredient: Pick<CatalogIngredient,"customerPaisePerUnit"|"min"|"max"|"step"|"unit">, quantity:number) {
  if (!Number.isFinite(quantity) || quantity < 0) throw new Error("Quantity must be zero or greater");
  if (quantity === 0) return 0;
  if (quantity < ingredient.min || quantity > ingredient.max) throw new Error(`Quantity must be between ${ingredient.min} and ${ingredient.max}`);
  const steps = (quantity - ingredient.min) / ingredient.step;
  if (Math.abs(steps - Math.round(steps)) > 1e-8) throw new Error(`Quantity must use steps of ${ingredient.step}`);
  return Math.round(quantity * ingredient.customerPaisePerUnit);
}
export function priceShake(_recipe: RecipeDef | null, selections: Selection[], catalog: CatalogIngredient[]) {
  const seen = new Set<string>(); let internalCostPaise = 0; let ingredientChargesPaise = 0;
  const lines = selections.filter(s => s.quantity > 0).map(selection => {
    if (seen.has(selection.ingredientId)) throw new Error("Duplicate ingredient"); seen.add(selection.ingredientId);
    const ingredient = catalog.find(i => i.id === selection.ingredientId); if (!ingredient || !ingredient.available) throw new Error("Ingredient unavailable");
    const internalCostPaiseForLine = ingredientCostPaise(ingredient, selection.quantity); const customerChargePaise = ingredientCustomerChargePaise(ingredient, selection.quantity);
    internalCostPaise += internalCostPaiseForLine; ingredientChargesPaise += customerChargePaise;
    return { ...selection, name:ingredient.name, unit:ingredient.unit, customerChargePaise, allergens:ingredient.allergens };
  });
  const hasBase = lines.some(line => catalog.find(i => i.id === line.ingredientId)?.category === "BASE");
  return { lines, internalCostPaise, ingredientChargesPaise, blendAndCupFeePaise, sellingPricePaise:blendAndCupFeePaise + ingredientChargesPaise, valid:hasBase, error:hasBase ? null : "Choose a liquid base" };
}
export function nutritionEstimate(selections:Selection[], catalog:CatalogIngredient[]) {
  let complete = true; const total = { calories:0,protein:0,carbs:0,sugars:0,fat:0,fibre:0 };
  for (const s of selections) { const i = catalog.find(x => x.id === s.ingredientId); if (!i?.nutrition) { complete = false; continue; } for (const key of Object.keys(total) as (keyof typeof total)[]) total[key] += i.nutrition[key] * s.quantity / 100; }
  return { ...Object.fromEntries(Object.entries(total).map(([k,v])=>[k,Math.round(v*10)/10])) as typeof total, complete };
}
export const money = (paise:number) => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",minimumFractionDigits:0,maximumFractionDigits:2}).format(paise/100);
