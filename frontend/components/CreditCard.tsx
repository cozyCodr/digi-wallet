"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface CreditCardProps {
  type: "gold" | "platinum"
}

export default function CreditCard({ type }: CreditCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const cardColors = {
    gold: {
      background: "bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500",
      text: "text-gray-800",
      highlight: "text-yellow-700",
    },
    platinum: {
      background: "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500",
      text: "text-gray-800",
      highlight: "text-gray-700",
    },
  }

  const colors = cardColors[type]

  return (
    <motion.div
      className={`cursor-pointer w-96 h-56 rounded-xl shadow-2xl overflow-hidden relative ${colors.background}`}
      whileHover={{ scale: 1.05, rotateY: 15 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        backgroundImage: `url('/card-bg-${type}.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/90"></div>
      <div className={`absolute inset-0 p-6 flex flex-col justify-between ${colors.text}`}>
        <div className="flex justify-between items-start">
          <div className={`text-2xl font-bold font-sans ${type == "gold" ? "text-orange-300/80" : "text-slate-400"}`}>Digi. {type.charAt(0).toUpperCase() + type.slice(1)}</div>
          <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill="currentColor"
              className={type == "gold" ? "text-orange-300/80" : "text-slate-400"}
            />
          </svg>
        </div>
        <div>
          <div className={`text-2xl mb-2 font-mono tracking-wider ${type == "gold" ? "text-orange-300/80" : "text-slate-400"}`}>
            <span className="mr-4">1234</span>
            <span className="mr-4">5678</span>
            <span className="mr-4">9012</span>
            <span>3456</span>
          </div>
          <div className={`flex justify-between items-end ${type == "gold" ? "text-orange-300/80" : "text-slate-400"}`}>
            <div>
              <div className="text-xs uppercase font-sans">Card Holder</div>
              <div className="text-lg font-sans">John Doe</div>
            </div>
            <div>
              <div className="text-xs uppercase font-sans">Expires</div>
              <div className="text-lg font-sans">12/25</div>
            </div>
          </div>
        </div>
      </div>
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.03 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

