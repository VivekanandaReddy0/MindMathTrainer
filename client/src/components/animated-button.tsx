import React from "react";
import { motion } from "framer-motion";

interface AnimatedButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "accent";
  icon?: React.ReactNode;
  delay?: number;
}

export function AnimatedButton({
  children,
  className = "",
  onClick,
  variant = "primary",
  icon,
  delay = 0
}: AnimatedButtonProps) {
  let variantClass = "";
  
  switch (variant) {
    case "primary":
      variantClass = "bg-primary";
      break;
    case "secondary":
      variantClass = "bg-secondary";
      break;
    case "accent":
      variantClass = "bg-accent";
      break;
    default:
      variantClass = "bg-primary";
  }
  
  return (
    <motion.button
      className={`w-full ${variantClass} hover:bg-opacity-90 text-white font-poppins font-semibold py-3 px-6 rounded-xl transition duration-300 glass ${className}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: delay,
        type: "spring", 
        stiffness: 260, 
        damping: 20
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" 
      }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center justify-center">
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </div>
    </motion.button>
  );
}