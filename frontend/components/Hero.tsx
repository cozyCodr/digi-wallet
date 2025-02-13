"use client"

import { motion } from "framer-motion"
import CreditCard from "./CreditCard"

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center">
      <div className="text-center z-10">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to Digi Wallet
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          The future of digital payments is here
        </motion.p>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ rotate: -15, x: -200 }}
          animate={{ rotate: -5, x: -100 }}
          transition={{ duration: 1, delay: 0.5, type: "spring" }}
        >
          <CreditCard type="gold" />
        </motion.div>
        <motion.div
          initial={{ rotate: 15, x: 200 }}
          animate={{ rotate: 5, x: 100 }}
          transition={{ duration: 1, delay: 0.7, type: "spring" }}
        >
          <CreditCard type="platinum" />
        </motion.div>
      </div>
    </section>
  )
}

