"use client"

import { motion } from "framer-motion"
import CreditCard from "./CreditCard"
import Button from "./Button"

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 mb-12 lg:mb-0">
          <motion.h1
            className="text-5xl lg:text-7xl font-bold mb-6 text-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            The Future of Digital Banking
          </motion.h1>
          <motion.p
            className="text-xl lg:text-2xl mb-8 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Experience seamless transactions with Digi Wallet's cutting-edge technology
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-lg">
              Get Your Wallet
            </Button>
          </motion.div>
        </div>
        <div className="lg:w-1/2 relative h-[400px]">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="absolute top-0 right-0 z-10"
          >
            <CreditCard type="gold" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute top-40 right-20 z-20"
          >
            <CreditCard type="platinum" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

