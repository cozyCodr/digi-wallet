import type React from "react" // Import React
import Header from "@/components/Header"
import ElectricGrid from "@/components/ElectricGrid"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <ElectricGrid />
      <Header />
      <main className="pt-20">{children}</main>
    </div>
  )
}
