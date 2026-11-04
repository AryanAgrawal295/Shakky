import { OrderConfirmation } from "@/components/order-confirmation";
export default async function Page({params,searchParams}:{params:Promise<{code:string}>;searchParams:Promise<{token?:string}>}){const {code}=await params;const {token=""}=await searchParams;return <OrderConfirmation code={code} token={token}/>;}
