import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { adminOrder, updateOrder, updatePayment } from "@/lib/orders";
export const runtime="nodejs";
export async function GET(_:Request,{params}:{params:Promise<{code:string}>}) { try { await requireAdmin(); const order=await adminOrder((await params).code); return order ? NextResponse.json(order) : NextResponse.json({error:"Order not found."},{status:404}); } catch { return NextResponse.json({error:"Unauthorized"},{status:401}); } }
export async function PATCH(request:Request,{params}:{params:Promise<{code:string}>}) { try { const admin=await requireAdmin(); const body=await request.json(); const code=(await params).code; const order=await (body.kind === "payment" ? updatePayment(code,body.status,admin,body.reason) : updateOrder(code,body.status,admin,body.reason)); return NextResponse.json(order); } catch(error) { return NextResponse.json({error:error instanceof Error?error.message:"Unable to update order."},{status:error instanceof Error&&error.message==="UNAUTHORIZED"?401:400}); } }
