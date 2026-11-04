import { NextResponse } from "next/server";
import { adminCookie, adminCookieName, validAdminPassword } from "@/lib/admin-auth";
export async function POST(request: Request) { const { password } = await request.json(); if (typeof password !== "string" || !validAdminPassword(password)) return NextResponse.json({error:"Incorrect staff password."},{status:401}); const response=NextResponse.json({ok:true}); response.cookies.set(adminCookieName,adminCookie(),{httpOnly:true,sameSite:"strict",secure:process.env.NODE_ENV==="production",path:"/",maxAge:60*60*12}); return response; }
