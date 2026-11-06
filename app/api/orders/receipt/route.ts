import { NextResponse } from "next/server";
import { customerOrder } from "@/lib/orders";
export const runtime = "nodejs";
export async function GET(request: Request) { const { searchParams } = new URL(request.url); const code=searchParams.get("code") ?? ""; const token=searchParams.get("token") ?? ""; const order=await customerOrder(code,token); return order ? NextResponse.json(order) : NextResponse.json({error:"Order not found."},{status:404}); }
