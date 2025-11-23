"use client";

import type { ReactNode } from "react";
import { clsx } from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={clsx("glass-panel rounded-3xl p-6 shadow-glow", className)}>
      {children}
    </div>
  );
}
