import React from "react";
import { cn } from "@/lib/utils";

interface CharacterProps {
  className?: string;
  color?: "blue" | "green" | "yellow" | "orange" | "purple" | "pink";
  animation?: "float" | "bounce" | "wiggle" | "none";
}

export const Character: React.FC<CharacterProps> = ({ 
  className, 
  color = "blue",
  animation = "float" 
}) => {
  const colorVariants = {
    blue: "fill-kid-blue",
    green: "fill-kid-green",
    yellow: "fill-kid-yellow",
    orange: "fill-kid-orange",
    purple: "fill-kid-purple",
    pink: "fill-kid-pink",
  };

  const animationVariants = {
    float: "animate-float",
    bounce: "animate-bounce-slow",
    wiggle: "animate-wiggle",
    none: "",
  };

  return (
    <div className={cn(animationVariants[animation], className)}>
      <svg width="120" height="150" viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
        {/* Body */}
        <ellipse cx="60" cy="100" rx="45" ry="50" className={colorVariants[color]} />
        
        {/* Head */}
        <circle cx="60" cy="45" r="30" className={colorVariants[color]} />
        
        {/* Eyes */}
        <circle cx="50" cy="40" r="6" fill="white" />
        <circle cx="70" cy="40" r="6" fill="white" />
        <circle cx="50" cy="40" r="3" fill="black" />
        <circle cx="70" cy="40" r="3" fill="black" />
        
        {/* Smile */}
        <path d="M45 55 Q60 70 75 55" stroke="black" strokeWidth="2" fill="none" />
        
        {/* Arms */}
        <ellipse cx="25" cy="85" rx="10" ry="25" transform="rotate(-30 25 85)" className={colorVariants[color]} />
        <ellipse cx="95" cy="85" rx="10" ry="25" transform="rotate(30 95 85)" className={colorVariants[color]} />

        {/* Accessories - Book or educational element */}
        <rect x="40" y="85" width="40" height="25" rx="3" fill="#FFD43B" />
        <line x1="60" y1="85" x2="60" y2="110" stroke="#FF9F45" strokeWidth="2" />
      </svg>
    </div>
  );
};