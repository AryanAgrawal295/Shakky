import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { listOrders } from "@/lib/orders";
export const runtime="nodejs";
export async function GET(request:Request) { try { await requireAdmin(); return NextResponse.json(await listOrders(new URL(request.url).searchParams.get("q") ?? "")); } catch { return NextResponse.json({error:"Unauthorized"},{status:401}); } }
