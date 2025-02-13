"use client"

import { motion } from "framer-motion"

export default function MovingLines() {
  return (
    <div className="fixed inset-0 z-0">
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute h-px bg-white opacity-20"
          style={{
            left: `${index * 25}%`,
            top: 0,
            bottom: 0,
          }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{
            duration: 2,
            delay: index * 0.2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute w-px bg-white opacity-20"
          style={{
            top: `${index * 25}%`,
            left: 0,
            right: 0,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: 2,
            delay: index * 0.2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

