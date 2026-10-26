import { describe,expect,it } from "vitest"; import { ingredientCostPaise, priceShake } from "./pricing"; import { ingredients,recipes } from "./catalog";
describe("pricing engine",()=>{
 it("prices 250ml milk at ₹15 when the litre costs ₹60",()=>expect(ingredientCostPaise(ingredients.find(i=>i.id==="milk")!,250)).toBe(1500));
 it("prices 80g banana at ₹6.40",()=>expect(ingredientCostPaise(ingredients.find(i=>i.id==="banana")!,80)).toBe(640));
 it("prices 8g cocoa at ₹4.80",()=>expect(ingredientCostPaise(ingredients.find(i=>i.id==="cocoa")!,8)).toBe(480));
 it("updates with quantity and configured price",()=>{const milk={...ingredients[0],costPaisePerUnit:7};expect(ingredientCostPaise(milk,250)).toBe(1750);expect(ingredientCostPaise(milk,300)).toBe(2100)});
 it("removes cost at zero and rejects negative or over max",()=>{const milk=ingredients[0];expect(ingredientCostPaise(milk,0)).toBe(0);expect(()=>ingredientCostPaise(milk,-1)).toThrow();expect(()=>ingredientCostPaise(milk,500)).toThrow()});
 it("requires valid steps",()=>expect(()=>ingredientCostPaise(ingredients[0],255)).toThrow());
 it("keeps two custom calculations independent",()=>{const recipe=recipes[0];const original={...recipe.defaults};priceShake(recipe,[{ingredientId:"milk",quantity:300}],ingredients);expect(recipe.defaults).toEqual(original)});
 it("requires a base and safely returns a customer price",()=>{const p=priceShake(null,[{ingredientId:"banana",quantity:80}],ingredients);expect(p.valid).toBe(false);expect(Number.isFinite(p.sellingPricePaise)).toBe(true)});
 it("prices every custom shake base at the fixed ₹20 starting price",()=>{expect(priceShake(null,[{ingredientId:"water",quantity:250}],ingredients).sellingPricePaise).toBe(2000);expect(priceShake(null,[{ingredientId:"milk",quantity:250}],ingredients).sellingPricePaise).toBe(2000);expect(priceShake(null,[{ingredientId:"low-fat-milk",quantity:250}],ingredients).sellingPricePaise).toBe(2000)});
 it("adds peanut butter and oats on top of the fixed ₹20 base",()=>{const p=priceShake(null,[{ingredientId:"water",quantity:250},{ingredientId:"peanut-butter",quantity:20},{ingredientId:"oats",quantity:30}],ingredients);expect(p.sellingPricePaise).toBe(3150)});
 it("uses the requested fixed serving costs for whey, blueberry, dry fruits, and seeds",()=>{expect(ingredientCostPaise(ingredients.find(i=>i.id==="whey")!,30)).toBe(7000);expect(ingredientCostPaise(ingredients.find(i=>i.id==="blueberry")!,60)).toBe(5000);expect(ingredientCostPaise(ingredients.find(i=>i.id==="dry-fruits")!,20)).toBe(3000);expect(ingredientCostPaise(ingredients.find(i=>i.id==="seeds")!,15)).toBe(1000)});
 it("loads all eight signatures",()=>expect(recipes).toHaveLength(8));
});
