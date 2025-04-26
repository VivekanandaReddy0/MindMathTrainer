import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div className={cn("glass rounded-3xl p-8 text-center animate-scale-in", className)}>
      {children}
    </div>
  );
}
