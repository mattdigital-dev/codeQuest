"use client";

import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

const buttonStyles = cva(
  "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
  {
    variants: {
      intent: {
        primary: "bg-sand text-dusk hover:bg-[#f3dca6] focus-visible:outline-sand",
        secondary: "bg-white/60 text-dusk border border-white/70 hover:bg-white focus-visible:outline-white",
        ghost: "bg-transparent text-white hover:bg-white/10 focus-visible:outline-white",
      },
    },
    defaultVariants: {
      intent: "primary",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  intent?: "primary" | "secondary" | "ghost";
};

export function Button({ className, intent, ...props }: ButtonProps) {
  return <button className={clsx(buttonStyles({ intent }), className)} {...props} />;
}
