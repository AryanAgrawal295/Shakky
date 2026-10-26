import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
export const metadata:Metadata={title:"SHAKE LAB — Build your shake",description:"Choose your shake ingredients and see the price instantly."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className="font-sans antialiased"><Header/>{children}<Footer/></body></html>}
