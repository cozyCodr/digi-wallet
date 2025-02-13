import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import ElectricGrid from "@/components/ElectricGrid"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white overflow-hidden relative">
      <ElectricGrid />
      <div className="relative z-10">
        <Header />
        <HeroSection />
      </div>
    </main>
  )
}

