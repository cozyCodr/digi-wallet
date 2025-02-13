'use client'

import type React from "react"
import ElectricGrid from "@/components/ElectricGrid"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/store/auth"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ElectricGrid className="z-0" />
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-primary">
            Digi. Wallet
          </Link>
          <nav>
            <Button variant="default" onClick={() => logout()}>
              Logout
            </Button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 pt-24 pb-12">
        {children}
      </main>
    </div>
  )
}

