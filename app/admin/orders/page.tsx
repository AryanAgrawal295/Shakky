import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { AdminOrders } from "@/components/admin-orders";
export default async function Page(){if(!await isAdmin())redirect("/admin/login");return <AdminOrders/>;}
