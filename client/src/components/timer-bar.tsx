import { useEffect, useRef } from "react";

interface TimerBarProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  className?: string;
  restart?: boolean;
}

export function TimerBar({ duration, onTimeUp, className = "", restart = false }: TimerBarProps) {
  const timerBarRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!timerBarRef.current) return;
    
    // Reset timer animation
    timerBarRef.current.classList.remove("animate-progress");
    void timerBarRef.current.offsetWidth; // Trigger reflow
    timerBarRef.current.classList.add("animate-progress");
    
    // Set up the timeout
    const timer = setTimeout(() => {
      onTimeUp();
    }, duration * 1000);
    
    return () => {
      clearTimeout(timer);
    };
  }, [duration, onTimeUp, restart]);
  
  return (
    <div className="w-full h-2 bg-white bg-opacity-20 rounded-full">
      <div 
        ref={timerBarRef}
        className={`progress-bar h-2 rounded-full w-full animate-progress ${className}`}
        style={{ animationDuration: `${duration}s` }}
      />
    </div>
  );
}
