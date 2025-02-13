"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface Firefly {
  id: number
  startX: number
  startY: number
  endX: number
  endY: number
  delay: number
}

type Props = {
  className?: string
}

const ElectricGrid = ({ className }: Props) => {
  const [fireflies, setFireflies] = useState<Firefly[]>([])

  useEffect(() => {
    const createFireflies = () => {
      const newFireflies: Firefly[] = []
      for (let i = 0; i < 20; i++) {
        newFireflies.push({
          id: i,
          startX: Math.random() * 100,
          startY: Math.random() * 100,
          endX: Math.random() * 100,
          endY: Math.random() * 100,
          delay: Math.random() * 10,
        })
      }
      setFireflies(newFireflies)
    }

    createFireflies()
    const interval = setInterval(createFireflies, 15000) // Recreate fireflies every 15 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`fixed inset-0 z-0 ${className}`}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#0c1220" />
        {fireflies.map((firefly) => (
          <g key={firefly.id}>
            <motion.circle
              cx={`${firefly.startX}%`}
              cy={`${firefly.startY}%`}
              r="1"
              fill="#4a90e2"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                cx: [`${firefly.startX}%`, `${firefly.endX}%`],
                cy: [`${firefly.startY}%`, `${firefly.endY}%`],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                delay: firefly.delay,
                ease: "easeInOut",
              }}
            />
            <motion.line
              x1={`${firefly.startX}%`}
              y1={`${firefly.startY}%`}
              x2={`${firefly.endX}%`}
              y2={`${firefly.endY}%`}
              stroke="#4a90e2"
              strokeWidth="0.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                delay: firefly.delay,
                ease: "easeInOut",
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  )
}

export default ElectricGrid