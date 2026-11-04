import type { Selection } from "@/lib/pricing";

export type CartItem = {
  id: string;
  recipeSlug?: string;
  name: string;
  itemType: "SIGNATURE" | "CUSTOM";
  selections: Selection[];
  quantity: number;
};

export type OrderStatus = "PLACED" | "ACCEPTED" | "PREPARING" | "READY_FOR_PICKUP" | "COMPLETED" | "CANCELLED" | "REJECTED";
export type PaymentStatus = "NOT_CONFIRMED" | "CUSTOMER_CLAIMED_PAID" | "VERIFIED" | "REJECTED";

export const unitLabel = (unit: string) => unit === "MILLILITRE" ? "ml" : unit === "GRAM" ? "g" : "pc";
