import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  title: string;
  icon: React.ReactNode;
}

export function AnimatedNumber({ value, title, icon }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
      
      // Animate the counter
      let startValue = 0;
      const duration = 1500; // milliseconds
      const frameDuration = 1000 / 60; // 60fps
      const totalFrames = Math.round(duration / frameDuration);
      const increment = value / totalFrames;
      
      let currentFrame = 0;
      
      const counter = setInterval(() => {
        currentFrame++;
        const newValue = Math.min(Math.floor(startValue + (increment * currentFrame)), value);
        setDisplayValue(newValue);
        
        if (currentFrame === totalFrames) {
          clearInterval(counter);
        }
      }, frameDuration);
      
      return () => clearInterval(counter);
    }
  }, [isInView, value, controls]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.2
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center text-center glass"
    >
      <motion.div 
        variants={iconVariants} 
        className="text-accent mb-2 text-3xl"
      >
        {icon}
      </motion.div>
      <span className="text-2xl md:text-3xl font-bold text-white">{displayValue}</span>
      <span className="text-sm text-gray-300 mt-1">{title}</span>
    </motion.div>
  );
}