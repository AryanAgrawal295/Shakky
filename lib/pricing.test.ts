import { describe, expect, it } from "vitest";
import { blendAndCupFeePaise, ingredientCostPaise, ingredientCustomerChargePaise, priceShake } from "./pricing";
import { ingredients, recipes } from "./catalog";
const get = (id:string) => ingredients.find(i => i.id === id)!;
describe("customer ingredient pricing",()=>{
 it("uses the approved shared rate for milk in every future shake",()=>expect(ingredientCustomerChargePaise(get("milk"),250)).toBe(5750));
 it("keeps banana customer pricing above usable yield-adjusted cost",()=>{expect(ingredientCostPaise(get("banana"),100)).toBe(923);expect(ingredientCustomerChargePaise(get("banana"),100)).toBe(1000)});
 it("keeps whey at or above its raw internal cost",()=>expect(ingredientCustomerChargePaise(get("whey"),15)).toBe(4200));
 it("adds the visible ₹20 Blend & Cup Fee",()=>{const quote=priceShake(null,[{ingredientId:"water",quantity:250}],ingredients);expect(quote.blendAndCupFeePaise).toBe(blendAndCupFeePaise);expect(quote.sellingPricePaise).toBe(2000)});
 it("removing an ingredient reduces the customer total",()=>{const withBanana=priceShake(null,[{ingredientId:"milk",quantity:250},{ingredientId:"banana",quantity:100}],ingredients);const withoutBanana=priceShake(null,[{ingredientId:"milk",quantity:250}],ingredients);expect(withBanana.sellingPricePaise-withoutBanana.sellingPricePaise).toBe(1000)});
 it("uses one centralized price set for signatures",()=>{const prices=recipes.map(recipe=>priceShake(null,Object.entries(recipe.defaults).map(([ingredientId,quantity])=>({ingredientId,quantity})),ingredients).sellingPricePaise);expect(prices).toEqual([9390,10210,11036,13590,12961,13990,13870,14130])});
 it("keeps eight signatures",()=>expect(recipes).toHaveLength(8));
});
