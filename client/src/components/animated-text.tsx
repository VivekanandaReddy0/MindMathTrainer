import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  type?: "heading" | "paragraph";
}

export function AnimatedText({ 
  text, 
  className = "", 
  delay = 0, 
  type = "heading"
}: AnimatedTextProps) {
  // Split the text into lines
  const lines = text.split("\\n");
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay * i },
    }),
  };
  
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };
  
  return (
    <>
      {lines.map((line, lineIndex) => (
        <motion.div
          key={lineIndex}
          style={{ overflow: "hidden", display: "flex", flexWrap: "wrap" }}
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {line.split(" ").map((word, i) => (
            <motion.span
              key={i}
              variants={child}
              className={`inline-block mr-1 ${type === "heading" ? "font-bold" : ""} ${className}`}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
      ))}
    </>
  );
}