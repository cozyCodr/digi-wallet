
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Header() {
  return (
    <header className="absolute w-full z-20">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-400">
          Digi Wallet
        </Link>
        <Link href={"/signup"}>
          <Button
            variant="outline"
            className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-gray-900"
          >
            Get Started
          </Button>
        </Link>
      </div>
    </header>
  )
}

