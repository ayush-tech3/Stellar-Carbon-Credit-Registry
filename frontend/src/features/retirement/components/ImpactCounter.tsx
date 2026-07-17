"use client";

import { useTotalRetired } from "../hooks/use-retirement";
import { formatAmount } from "@/lib/utils/format";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ImpactCounter() {
  const { data: totalRetired, isLoading } = useTotalRetired();
  const [displayValue, setDisplayValue] = useState(0);

  // Animate counter
  useEffect(() => {
    if (totalRetired !== undefined) {
      const target = Number(totalRetired);
      const start = displayValue;
      const duration = 2000; // 2 seconds
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (target - start) * easeOut;
        
        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(target);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [totalRetired, displayValue]);

  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-2xl glass-card relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center"
      >
        <h2 className="text-gray-400 uppercase tracking-widest text-sm font-semibold mb-4">
          Global Carbon Offset
        </h2>
        
        <div className="flex items-baseline justify-center gap-2 mb-2 pulse-glow rounded-full px-8 py-2">
          {isLoading ? (
            <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              ---
            </span>
          ) : (
            <>
              <span className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 tabular-nums tracking-tight">
                {formatAmount(Math.round(displayValue))}
              </span>
              <span className="text-2xl md:text-4xl font-bold text-emerald-500/50">
                tons
              </span>
            </>
          )}
        </div>
        
        <p className="text-gray-400 mt-4 max-w-md mx-auto">
          CO₂ permanently retired from the atmosphere through transparent, verifiable smart contracts.
        </p>
      </motion.div>
    </div>
  );
}
