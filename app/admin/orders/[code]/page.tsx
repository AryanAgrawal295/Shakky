import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { AdminOrderDetail } from "@/components/admin-order-detail";
export default async function Page({params}:{params:Promise<{code:string}>}){if(!await isAdmin())redirect("/admin/login");return <AdminOrderDetail code={(await params).code}/>;}
