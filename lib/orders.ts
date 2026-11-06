import crypto from "node:crypto";
import { MongoClient } from "mongodb";
import { ingredients, recipes } from "@/lib/catalog";
import { priceShake, type Selection } from "@/lib/pricing";
import type { CartItem, OrderStatus, PaymentStatus } from "@/lib/order-types";

type StoredOrder = { id: string; public_id: string; receipt_token: string; customer_name: string; customer_phone: string; customer_note: string | null; pickup_location: string; order_status: OrderStatus; payment_status: PaymentStatus; payment_acknowledged: number; payment_acknowledged_at: string | null; subtotal: number; additional_charges: number; total_amount: number; idempotency_key: string; created_at: string; updated_at: string; completed_at: string | null; completed_by: string | null };
type StoredItem = { id: string; order_id: string; recipe_slug: string | null; recipe_name_snapshot: string; item_type: "SIGNATURE" | "CUSTOM"; quantity: number; unit_price: number; line_total: number; image_slug: string | null; created_at: string };
type StoredIngredient = { id: string; order_item_id: string; ingredient_id: string; ingredient_name_snapshot: string; quantity: number; unit: string; customer_rate_snapshot: number; ingredient_charge_snapshot: number; internal_cost_snapshot: number };
type HydratedOrder = StoredOrder & { items: Array<StoredItem & { ingredients: StoredIngredient[] }> };

declare global { var shakeLabMongo: Promise<MongoClient> | undefined; var shakeLabMongoIndexes: Promise<void> | undefined; }

const uuid = () => crypto.randomUUID();
const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const orderCode = () => `SL-${Array.from(crypto.randomBytes(7), byte => alphabet[byte % alphabet.length]).join("")}`;

async function database() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured. Add it to your environment variables.");
  if (!global.shakeLabMongo) global.shakeLabMongo = new MongoClient(uri).connect();
  const client = await global.shakeLabMongo;
  const db = client.db(process.env.MONGODB_DB || "shake_lab");
  if (!global.shakeLabMongoIndexes) global.shakeLabMongoIndexes = Promise.all([
    db.collection<StoredOrder>("orders").createIndex({ public_id: 1 }, { unique: true }),
    db.collection<StoredOrder>("orders").createIndex({ receipt_token: 1 }, { unique: true }),
    db.collection<StoredOrder>("orders").createIndex({ idempotency_key: 1 }, { unique: true }),
    db.collection<StoredOrder>("orders").createIndex({ created_at: -1 }),
    db.collection<StoredItem>("order_items").createIndex({ order_id: 1 }),
    db.collection<StoredIngredient>("order_item_ingredients").createIndex({ order_item_id: 1 }),
  ]).then(() => undefined);
  await global.shakeLabMongoIndexes;
  return { client, db };
}

export function validatePhone(phone: string) { return /^[6-9]\d{9}$/.test(phone.replace(/\D/g, "")); }

function snapshotItem(input: CartItem) {
  if (!input || !Array.isArray(input.selections) || !Number.isInteger(input.quantity) || input.quantity < 1 || input.quantity > 20) throw new Error("Each shake quantity must be between 1 and 20.");
  const recipe = input.recipeSlug ? recipes.find(entry => entry.slug === input.recipeSlug) : undefined;
  if (input.itemType === "SIGNATURE" && !recipe) throw new Error("That signature shake is no longer available.");
  const selections: Selection[] = input.selections.map(selection => ({ ingredientId: String(selection.ingredientId), quantity: Number(selection.quantity) }));
  const quote = priceShake(recipe ?? null, selections, ingredients);
  if (!quote.valid) throw new Error(quote.error ?? "Choose a liquid base.");
  return { recipe, name: recipe?.name ?? "Custom Shake", quote, quantity: input.quantity };
}

export async function createOrder(input: { items: CartItem[]; customerName: string; customerPhone: string; customerNote?: string; paymentAcknowledged: boolean; idempotencyKey: string }) {
  const name = input.customerName.trim(); const phone = input.customerPhone.replace(/\D/g, ""); const note = input.customerNote?.trim() || null;
  if (!name || name.length > 80) throw new Error("Enter a name of up to 80 characters.");
  if (!validatePhone(phone)) throw new Error("Enter a valid 10-digit mobile number.");
  if (note && note.length > 300) throw new Error("Order note must be 300 characters or fewer.");
  if (!input.paymentAcknowledged) throw new Error("Confirm your payment acknowledgement before placing the order.");
  if (!input.idempotencyKey || input.idempotencyKey.length > 200) throw new Error("Invalid order request.");
  if (!Array.isArray(input.items) || !input.items.length || input.items.length > 20) throw new Error("Your cart must contain between 1 and 20 shakes.");
  const { client, db } = await database(); const orders = db.collection<StoredOrder>("orders");
  const existing = await orders.findOne({ idempotency_key: input.idempotencyKey });
  if (existing) return { publicOrderId: existing.public_id, receiptToken: existing.receipt_token, existing: true };
  const snapshots = input.items.map(snapshotItem); const subtotal = snapshots.reduce((sum, item) => sum + item.quote.sellingPricePaise * item.quantity, 0);
  const now = new Date().toISOString(); const id = uuid(); const receiptToken = crypto.randomBytes(24).toString("base64url");
  for (let attempt = 0; attempt < 10; attempt++) {
    const publicId = orderCode(); const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        const duplicate = await orders.findOne({ idempotency_key: input.idempotencyKey }, { session });
        if (duplicate) throw new Error("DUPLICATE_ORDER");
        const order: StoredOrder = { id, public_id: publicId, receipt_token: receiptToken, customer_name: name, customer_phone: phone, customer_note: note, pickup_location: "SHAKE LAB counter", order_status: "PLACED", payment_status: "CUSTOMER_CLAIMED_PAID", payment_acknowledged: 1, payment_acknowledged_at: now, subtotal, additional_charges: 0, total_amount: subtotal, idempotency_key: input.idempotencyKey, created_at: now, updated_at: now, completed_at: null, completed_by: null };
        await orders.insertOne(order, { session });
        const itemDocs: StoredItem[] = []; const ingredientDocs: StoredIngredient[] = [];
        for (const snapshot of snapshots) { const itemId = uuid(); itemDocs.push({ id: itemId, order_id: id, recipe_slug: snapshot.recipe?.slug ?? null, recipe_name_snapshot: snapshot.name, item_type: snapshot.recipe ? "SIGNATURE" : "CUSTOM", quantity: snapshot.quantity, unit_price: snapshot.quote.sellingPricePaise, line_total: snapshot.quote.sellingPricePaise * snapshot.quantity, image_slug: snapshot.recipe?.slug ?? null, created_at: now }); for (const line of snapshot.quote.lines) { const ingredient = ingredients.find(entry => entry.id === line.ingredientId)!; ingredientDocs.push({ id: uuid(), order_item_id: itemId, ingredient_id: ingredient.id, ingredient_name_snapshot: ingredient.name, quantity: line.quantity, unit: line.unit, customer_rate_snapshot: ingredient.customerPaisePerUnit, ingredient_charge_snapshot: line.customerChargePaise, internal_cost_snapshot: Math.round(line.quantity * ingredient.costPaisePerUnit) }); } }
        await db.collection<StoredItem>("order_items").insertMany(itemDocs, { session });
        await db.collection<StoredIngredient>("order_item_ingredients").insertMany(ingredientDocs, { session });
        await db.collection("order_status_history").insertOne({ id: uuid(), order_id: id, previous_status: null, new_status: "PLACED", changed_by: null, reason: null, timestamp: now }, { session });
        await db.collection("payment_history").insertOne({ id: uuid(), order_id: id, previous_status: null, new_status: "CUSTOMER_CLAIMED_PAID", changed_by: null, reason: null, timestamp: now }, { session });
      });
      return { publicOrderId: publicId, receiptToken, existing: false };
    } catch (error) {
      if (error instanceof Error && error.message === "DUPLICATE_ORDER") { const duplicate = await orders.findOne({ idempotency_key: input.idempotencyKey }); if (duplicate) return { publicOrderId: duplicate.public_id, receiptToken: duplicate.receipt_token, existing: true }; }
      if (!(typeof error === "object" && error && "code" in error && (error as { code?: number }).code === 11000)) throw error;
    } finally { await session.endSession(); }
  }
  throw new Error("Could not generate a unique order ID. Please try again.");
}

async function hydrateOrder(order: StoredOrder, db: Awaited<ReturnType<typeof database>>["db"]): Promise<HydratedOrder> {
  const items = await db.collection<StoredItem>("order_items").find({ order_id: order.id }).toArray();
  const ingredientsByItem = await Promise.all(items.map(async item => ({ itemId: item.id, ingredients: await db.collection<StoredIngredient>("order_item_ingredients").find({ order_item_id: item.id }).toArray() })));
  return { ...order, items: items.map(item => ({ ...item, ingredients: ingredientsByItem.find(entry => entry.itemId === item.id)?.ingredients ?? [] })) };
}

export async function customerOrder(code: string, token: string) { const { db } = await database(); const order = await db.collection<StoredOrder>("orders").findOne({ public_id: code.toUpperCase(), receipt_token: token }); return order ? hydrateOrder(order, db) : null; }
export async function listOrders(query = "") { const { db } = await database(); const trimmed = query.trim(); const filter = trimmed ? { $or: [{ public_id: { $regex: trimmed, $options: "i" } }, { customer_name: { $regex: trimmed, $options: "i" } }, { customer_phone: { $regex: trimmed } }] } : {}; const orders = await db.collection<StoredOrder>("orders").find(filter).sort({ created_at: -1 }).limit(100).toArray(); return Promise.all(orders.map(order => hydrateOrder(order, db))); }
export async function adminOrder(code: string) { const { db } = await database(); const order = await db.collection<StoredOrder>("orders").findOne({ public_id: code.toUpperCase() }); return order ? hydrateOrder(order, db) : null; }

const transitions: Record<OrderStatus, OrderStatus[]> = { PLACED:["ACCEPTED","REJECTED","CANCELLED"], ACCEPTED:["PREPARING","CANCELLED","REJECTED"], PREPARING:["READY_FOR_PICKUP","CANCELLED"], READY_FOR_PICKUP:["COMPLETED"], COMPLETED:[], CANCELLED:[], REJECTED:[] };
export async function updateOrder(code: string, next: OrderStatus, admin: string, reason?: string) { const { client, db } = await database(); const order = await db.collection<StoredOrder>("orders").findOne({ public_id: code.toUpperCase() }); if (!order) throw new Error("Order not found."); if (!transitions[order.order_status].includes(next)) throw new Error(`Cannot change ${order.order_status} to ${next}.`); const now = new Date().toISOString(); const session = client.startSession(); try { await session.withTransaction(async () => { await db.collection<StoredOrder>("orders").updateOne({ id: order.id, order_status: order.order_status }, { $set: { order_status: next, updated_at: now, completed_at: next === "COMPLETED" ? now : null, completed_by: next === "COMPLETED" ? admin : null } }, { session }); await db.collection("order_status_history").insertOne({ id: uuid(), order_id: order.id, previous_status: order.order_status, new_status: next, changed_by: admin, reason: reason ?? null, timestamp: now }, { session }); }); } finally { await session.endSession(); } return adminOrder(code) as Promise<HydratedOrder>; }
export async function updatePayment(code: string, next: PaymentStatus, admin: string, reason?: string) { const { client, db } = await database(); const order = await db.collection<StoredOrder>("orders").findOne({ public_id: code.toUpperCase() }); if (!order) throw new Error("Order not found."); if (next !== "VERIFIED" && next !== "REJECTED") throw new Error("Invalid payment update."); const now = new Date().toISOString(); const session = client.startSession(); try { await session.withTransaction(async () => { await db.collection<StoredOrder>("orders").updateOne({ id: order.id }, { $set: { payment_status: next, updated_at: now } }, { session }); await db.collection("payment_history").insertOne({ id: uuid(), order_id: order.id, previous_status: order.payment_status, new_status: next, changed_by: admin, reason: reason ?? null, timestamp: now }, { session }); }); } finally { await session.endSession(); } return adminOrder(code) as Promise<HydratedOrder>; }
