import type { CatalogIngredient, RecipeDef } from "./catalog";
import { blendAndCupFeePaise, priceShake } from "./pricing";

export type CalibrationTarget = { recipeId:string; targetPaise:number };
export type CalibrationResult = { proposedRates:Record<string,number>; comparisons:{ recipeId:string; currentPaise:number; targetPaise:number; proposedPaise:number; differencePaise:number }[] };

// Projected least-squares: rates are shared, never fall below usable internal cost,
// and this function is pure so calculating a proposal cannot change live catalog data.
export function calibrateSignatureMenu(recipes:RecipeDef[], catalog:CatalogIngredient[], targets:CalibrationTarget[]):CalibrationResult {
  const used = [...new Set(recipes.flatMap(recipe => Object.keys(recipe.defaults)))];
  const rates = Object.fromEntries(used.map(id => [id, catalog.find(i => i.id === id)!.customerPaisePerUnit]));
  const lowerBounds = Object.fromEntries(used.map(id => [id, catalog.find(i => i.id === id)!.costPaisePerUnit]));
  for (let iteration = 0; iteration < 12000; iteration++) for (const recipe of recipes) {
    const target = targets.find(item => item.recipeId === recipe.id); if (!target) continue;
    const current = blendAndCupFeePaise + Object.entries(recipe.defaults).reduce((sum,[id,quantity]) => sum + quantity * rates[id], 0);
    const error = current - target.targetPaise;
    for (const [id, quantity] of Object.entries(recipe.defaults)) rates[id] = Math.max(lowerBounds[id], rates[id] - error * quantity * 0.0000008);
  }
  const proposedCatalog = catalog.map(item => rates[item.id] === undefined ? item : { ...item, customerPaisePerUnit:rates[item.id] });
  return { proposedRates:rates, comparisons:recipes.map(recipe => { const target = targets.find(item => item.recipeId === recipe.id)?.targetPaise ?? 0; const currentPaise = priceShake(null,Object.entries(recipe.defaults).map(([ingredientId,quantity])=>({ingredientId,quantity})),catalog).sellingPricePaise; const proposedPaise = priceShake(null,Object.entries(recipe.defaults).map(([ingredientId,quantity])=>({ingredientId,quantity})),proposedCatalog).sellingPricePaise; return { recipeId:recipe.id,currentPaise,targetPaise:target,proposedPaise,differencePaise:proposedPaise-target }; }) };
}
