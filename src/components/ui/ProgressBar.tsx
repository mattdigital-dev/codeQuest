"use client";

interface ProgressBarProps {
  value: number;
  total: number;
}

export function ProgressBar({ value, total }: ProgressBarProps) {
  const ratio = Math.min(1, value / total);
  return (
    <div className="h-3 w-full rounded-full bg-white/40">
      <div
        className="h-full rounded-full bg-gradient-to-r from-sand via-lilac to-sky transition-[width]"
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  );
}
