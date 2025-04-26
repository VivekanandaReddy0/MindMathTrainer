import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Define math symbols to animate
const symbols = ["+", "-", "×", "÷", "=", "√", "π", "%", "^"];

// Different sizes for the floating elements
const sizes = ["text-xl", "text-2xl", "text-3xl", "text-4xl"];

// Different opacities for the floating elements
const opacities = ["opacity-10", "opacity-20", "opacity-30"];

interface FloatingSymbol {
  id: number;
  symbol: string;
  x: number;
  y: number;
  size: string;
  opacity: string;
  duration: number;
  delay: number;
}

export function FloatingSymbols() {
  const [floatingSymbols, setFloatingSymbols] = useState<FloatingSymbol[]>([]);
  
  useEffect(() => {
    // Create 15 random floating symbols
    const newSymbols: FloatingSymbol[] = [];
    
    for (let i = 0; i < 15; i++) {
      newSymbols.push({
        id: i,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        x: Math.random() * 100, // Random x position (%)
        y: Math.random() * 100, // Random y position (%)
        size: sizes[Math.floor(Math.random() * sizes.length)],
        opacity: opacities[Math.floor(Math.random() * opacities.length)],
        duration: 15 + Math.random() * 25, // Random animation duration (15-40s)
        delay: Math.random() * -20 // Random delay to stagger animations
      });
    }
    
    setFloatingSymbols(newSymbols);
  }, []);
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {floatingSymbols.map((item) => (
        <motion.div
          key={item.id}
          className={`absolute font-bold ${item.size} ${item.opacity} text-white`}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
          }}
          animate={{
            y: ["0%", "30%", "-30%", "0%"],
            x: ["0%", "20%", "-25%", "0%"],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: item.duration,
            ease: "linear",
            times: [0, 0.33, 0.66, 1],
            repeat: Infinity,
            delay: item.delay,
          }}
        >
          {item.symbol}
        </motion.div>
      ))}
    </div>
  );
}