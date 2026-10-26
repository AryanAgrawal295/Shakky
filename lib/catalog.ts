export type Unit = "GRAM" | "MILLILITRE" | "PIECE";
export type Category = "BASE" | "FRUIT" | "FLAVOUR" | "FILLER" | "NUT_BUTTER" | "PROTEIN" | "SWEETENER" | "OTHER";

export type CatalogIngredient = {
  id: string; name: string; slug: string; category: Category; unit: Unit;
  purchaseUnit: "KILOGRAM" | "LITRE" | "PIECE"; purchasePricePaise: number;
  purchaseQuantity: number; costPaisePerUnit: number; min: number; max: number; step: number;
  allergens: string[]; available: boolean; nutrition?: { calories: number; protein: number; carbs: number; sugars: number; fat: number; fibre: number };
};

export const ingredients: CatalogIngredient[] = [
  { id:"milk", name:"Regular milk", slug:"milk", category:"BASE", unit:"MILLILITRE", purchaseUnit:"LITRE", purchasePricePaise:6000, purchaseQuantity:1000, costPaisePerUnit:6, min:150,max:400,step:10,allergens:["Milk"],available:true,nutrition:{calories:61,protein:3.2,carbs:4.8,sugars:5, fat:3.3,fibre:0}},
  { id:"low-fat-milk", name:"Low-fat milk", slug:"low-fat-milk", category:"BASE", unit:"MILLILITRE", purchaseUnit:"LITRE", purchasePricePaise:7000,purchaseQuantity:1000,costPaisePerUnit:7,min:150,max:400,step:10,allergens:["Milk"],available:true,nutrition:{calories:45,protein:3.4,carbs:5,sugars:5,fat:1.5,fibre:0}},
  { id:"water", name:"Chilled water", slug:"water", category:"BASE",unit:"MILLILITRE",purchaseUnit:"LITRE",purchasePricePaise:100,purchaseQuantity:1000,costPaisePerUnit:.1,min:150,max:400,step:10,allergens:[],available:true,nutrition:{calories:0,protein:0,carbs:0,sugars:0,fat:0,fibre:0}},
  { id:"banana",name:"Banana",slug:"banana",category:"FRUIT",unit:"GRAM",purchaseUnit:"KILOGRAM",purchasePricePaise:8000,purchaseQuantity:1000,costPaisePerUnit:8,min:20,max:200,step:10,allergens:[],available:true,nutrition:{calories:89,protein:1.1,carbs:22.8,sugars:12.2,fat:.3,fibre:2.6}},
  { id:"apple",name:"Apple",slug:"apple",category:"FRUIT",unit:"GRAM",purchaseUnit:"KILOGRAM",purchasePricePaise:16000,purchaseQuantity:1000,costPaisePerUnit:16,min:20,max:200,step:10,allergens:[],available:true,nutrition:{calories:52,protein:.3,carbs:13.8,sugars:10.4,fat:.2,fibre:2.4}},
  { id:"strawberry",name:"Strawberry puree",slug:"strawberry-puree",category:"FRUIT",unit:"GRAM",purchaseUnit:"KILOGRAM",purchasePricePaise:30000,purchaseQuantity:1000,costPaisePerUnit:30,min:20,max:120,step:10,allergens:[],available:true,nutrition:{calories:45,protein:.7,carbs:10,sugars:7,fat:.3,fibre:2}},
  { id:"blueberry",name:"Blueberry",slug:"blueberry",category:"FRUIT",unit:"GRAM",purchaseUnit:"KILOGRAM",purchasePricePaise:833333,purchaseQuantity:1000,costPaisePerUnit:5000/60,min:20,max:120,step:10,allergens:[],available:true,nutrition:{calories:57,protein:.7,carbs:14.5,sugars:10,fat:.3,fibre:2.4}},
  { id:"cocoa",name:"Cocoa powder",slug:"cocoa-powder",category:"FLAVOUR",unit:"GRAM",purchaseUnit:"KILOGRAM",purchasePricePaise:60000,purchaseQuantity:1000,costPaisePerUnit:60,min:2,max:25,step:1,allergens:[],available:true,nutrition:{calories:228,protein:19.6,carbs:57.9,sugars:1.8,fat:13.7,fibre:37}},
  { id:"vanilla",name:"Vanilla flavour",slug:"vanilla-flavour",category:"FLAVOUR",unit:"MILLILITRE",purchaseUnit:"LITRE",purchasePricePaise:40000,purchaseQuantity:1000,costPaisePerUnit:40,min:1,max:10,step:1,allergens:[],available:true},
  { id:"coffee",name:"Instant coffee",slug:"instant-coffee",category:"FLAVOUR",unit:"GRAM",purchaseUnit:"KILOGRAM",purchasePricePaise:100000,purchaseQuantity:1000,costPaisePerUnit:100,min:1,max:10,step:1,allergens:[],available:true},
  { id:"oats",name:"Rolled oats",slug:"oats",category:"FILLER",unit:"GRAM",purchaseUnit:"KILOGRAM",purchasePricePaise:15000,purchaseQuantity:1000,costPaisePerUnit:15,min:10,max:80,step:5,allergens:["May contain gluten"],available:true,nutrition:{calories:389,protein:16.9,carbs:66.3,sugars:.9,fat:6.9,fibre:10.6}},
  { id:"peanut-butter",name:"Peanut butter",slug:"peanut-butter",category:"NUT_BUTTER",unit:"GRAM",purchaseUnit:"KILOGRAM",purchasePricePaise:35000,purchaseQuantity:1000,costPaisePerUnit:35,min:5,max:50,step:5,allergens:["Peanuts"],available:true,nutrition:{calories:588,protein:25,carbs:20,sugars:9,fat:50,fibre:6}},
  { id:"dry-fruits",name:"Dry fruits",slug:"dry-fruits",category:"OTHER",unit:"GRAM",purchaseUnit:"KILOGRAM",purchasePricePaise:150000,purchaseQuantity:1000,costPaisePerUnit:150,min:5,max:50,step:5,allergens:["Tree nuts"],available:true,nutrition:{calories:550,protein:16,carbs:35,sugars:28,fat:42,fibre:7}},
  { id:"seeds",name:"Seeds",slug:"seeds",category:"OTHER",unit:"GRAM",purchaseUnit:"KILOGRAM",purchasePricePaise:66667,purchaseQuantity:1000,costPaisePerUnit:1000/15,min:5,max:50,step:5,allergens:[],available:true,nutrition:{calories:550,protein:20,carbs:20,sugars:1,fat:45,fibre:12}},
  { id:"whey",name:"Whey concentrate",slug:"whey-protein",category:"PROTEIN",unit:"GRAM",purchaseUnit:"KILOGRAM",purchasePricePaise:233333,purchaseQuantity:1000,costPaisePerUnit:7000/30,min:5,max:60,step:5,allergens:["Milk"],available:true,nutrition:{calories:400,protein:75,carbs:10,sugars:5,fat:7,fibre:0}},
  { id:"sugar",name:"Cane sugar",slug:"sugar",category:"SWEETENER",unit:"GRAM",purchaseUnit:"KILOGRAM",purchasePricePaise:5000,purchaseQuantity:1000,costPaisePerUnit:5,min:1,max:20,step:1,allergens:[],available:true,nutrition:{calories:400,protein:0,carbs:100,sugars:100,fat:0,fibre:0}}
];

export type RecipeDef = { id:string; slug:string; name:string; description:string; category:string; basePricePaise:number; accent:string; defaults:Record<string,number> };
export const recipes: RecipeDef[] = [
  {id:"chocolate-daily",slug:"chocolate-daily",name:"Chocolate Daily",description:"Everyday chocolate-banana comfort, blended smooth.",category:"Everyday",basePricePaise:12900,accent:"#6F4431",defaults:{milk:250,banana:80,cocoa:8,sugar:8}},
  {id:"banana-bulk",slug:"banana-bulk",name:"Banana Bulk",description:"A filling banana, oats and peanut butter blend.",category:"Filling",basePricePaise:16900,accent:"#E9C65C",defaults:{milk:300,banana:150,oats:40,"peanut-butter":15}},
  {id:"vanilla-banana",slug:"vanilla-banana",name:"Vanilla Banana",description:"Simple, mellow vanilla with real banana.",category:"Everyday",basePricePaise:13900,accent:"#E8D7A9",defaults:{milk:250,banana:100,vanilla:3,sugar:8}},
  {id:"chocolate-power",slug:"chocolate-power",name:"Chocolate Power",description:"Chocolate and banana with optional whey.",category:"High protein",basePricePaise:19900,accent:"#4A2A20",defaults:{milk:250,whey:30,cocoa:8,banana:60}},
  {id:"pro-cold-coffee",slug:"pro-cold-coffee",name:"Pro Cold Coffee",description:"Bold coffee, chilled milk and whey.",category:"High protein",basePricePaise:20900,accent:"#8B694D",defaults:{milk:250,whey:30,coffee:3,sugar:8}},
  {id:"strawberry-pro",slug:"strawberry-pro",name:"Strawberry Pro",description:"Bright strawberry with a protein boost.",category:"High protein",basePricePaise:21900,accent:"#DF7D78",defaults:{milk:250,whey:30,strawberry:60,sugar:5}},
  {id:"banana-pb-pro",slug:"banana-pb-pro",name:"Banana PB Pro",description:"Creamy banana, peanut butter and whey.",category:"High protein",basePricePaise:22900,accent:"#C28B45",defaults:{milk:250,whey:30,banana:100,"peanut-butter":20}},
  {id:"choco-oats-pro",slug:"choco-oats-pro",name:"Choco Oats Pro",description:"Chocolate, oats and whey in one hearty blend.",category:"High protein",basePricePaise:21900,accent:"#78513D",defaults:{milk:250,whey:30,oats:30,cocoa:8}}
];

