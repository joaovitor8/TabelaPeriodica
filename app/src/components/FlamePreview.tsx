"use client";

interface FlamePreviewProps {
  color: string;
  size?: number;
}

export function FlamePreview({ color, size = 96 }: FlamePreviewProps) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-md border border-white/10 bg-black"
      style={{ width: size, height: size }}
    >
      {/* base hot core */}
      <div
        className="absolute inset-x-0 bottom-0 flame-core"
        style={{
          height: "78%",
          background: `radial-gradient(ellipse at 50% 100%, ${color} 0%, ${color}cc 28%, ${color}55 55%, transparent 78%)`,
          filter: "blur(2px)",
          mixBlendMode: "screen",
        }}
      />
      {/* inner brighter tongue */}
      <div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 flame-tongue"
        style={{
          width: "55%",
          height: "62%",
          background: `radial-gradient(ellipse at 50% 100%, #fff 0%, ${color}ee 30%, ${color}55 65%, transparent 85%)`,
          filter: "blur(1px)",
          mixBlendMode: "screen",
        }}
      />
      {/* embers */}
      <div
        className="absolute inset-x-0 bottom-0 h-3"
        style={{
          background: `linear-gradient(to top, ${color}, transparent)`,
          opacity: 0.85,
        }}
      />
    </div>
  );
}
