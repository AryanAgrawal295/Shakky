import { NextResponse } from "next/server";
import { createOrder } from "@/lib/orders";
export const runtime = "nodejs";
export async function POST(request: Request) { try { const body = await request.json(); const order = createOrder(body); return NextResponse.json(order, { status: 201 }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to place your order." }, { status: 400 }); } }
