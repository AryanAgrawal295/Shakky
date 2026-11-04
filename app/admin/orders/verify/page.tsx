import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { PickupVerifier } from "@/components/pickup-verifier";
export default async function Page(){if(!await isAdmin())redirect("/admin/login");return <PickupVerifier/>;}
