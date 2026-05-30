"use client";

interface SpectrumBarProps {
  lines: number[];
  min?: number;
  max?: number;
}

/** Aproxima a cor visível para um comprimento de onda (nm). Algoritmo clássico de Bruton. */
function wavelengthToRgb(wl: number): [number, number, number] {
  let r = 0,
    g = 0,
    b = 0;

  if (wl >= 380 && wl < 440) {
    r = -(wl - 440) / (440 - 380);
    b = 1;
  } else if (wl >= 440 && wl < 490) {
    g = (wl - 440) / (490 - 440);
    b = 1;
  } else if (wl >= 490 && wl < 510) {
    g = 1;
    b = -(wl - 510) / (510 - 490);
  } else if (wl >= 510 && wl < 580) {
    r = (wl - 510) / (580 - 510);
    g = 1;
  } else if (wl >= 580 && wl < 645) {
    r = 1;
    g = -(wl - 645) / (645 - 580);
  } else if (wl >= 645 && wl <= 780) {
    r = 1;
  }

  let factor = 0;
  if (wl >= 380 && wl < 420) factor = 0.3 + (0.7 * (wl - 380)) / (420 - 380);
  else if (wl >= 420 && wl < 700) factor = 1;
  else if (wl >= 700 && wl <= 780) factor = 0.3 + (0.7 * (780 - wl)) / (780 - 700);

  const gamma = 0.8;
  const ch = (v: number) => Math.round(255 * Math.pow(v * factor, gamma));
  return [ch(r), ch(g), ch(b)];
}

function rgbCss([r, g, b]: [number, number, number], a = 1) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

const VIS_GRADIENT = (() => {
  const stops: string[] = [];
  for (let wl = 380; wl <= 780; wl += 10) {
    stops.push(`${rgbCss(wavelengthToRgb(wl))} ${((wl - 380) / 400) * 100}%`);
  }
  return `linear-gradient(to right, ${stops.join(", ")})`;
})();

export function SpectrumBar({ lines, min = 380, max = 780 }: SpectrumBarProps) {
  const visibleLines = lines.filter((wl) => wl >= min && wl <= max);
  const invisibleLines = lines.filter((wl) => wl < min || wl > max);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-8 rounded-md overflow-hidden border border-white/10 bg-black">
        {/* Banda contínua do visível */}
        <div className="absolute inset-0 opacity-40" style={{ background: VIS_GRADIENT }} />
        {/* Faixa de fundo escura */}
        <div className="absolute inset-0 bg-black/55" />
        {/* Linhas espectrais */}
        {visibleLines.map((wl, i) => {
          const x = ((wl - min) / (max - min)) * 100;
          const color = rgbCss(wavelengthToRgb(wl));
          return (
            <div
              key={`${wl}-${i}`}
              className="absolute top-0 bottom-0 w-px"
              style={{
                left: `${x}%`,
                background: color,
                boxShadow: `0 0 6px ${color}, 0 0 14px ${color}`,
              }}
            />
          );
        })}
        {/* Marcadores 400/500/600/700 */}
        {[400, 500, 600, 700].map((wl) => {
          const x = ((wl - min) / (max - min)) * 100;
          return (
            <span
              key={wl}
              className="absolute bottom-0 text-[8px] font-mono text-white/40 -translate-x-1/2"
              style={{ left: `${x}%`, lineHeight: 1 }}
            >
              {wl}
            </span>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {lines.map((wl, i) => {
          const inRange = wl >= min && wl <= max;
          const rgb = inRange ? wavelengthToRgb(wl) : null;
          const color = rgb ? rgbCss(rgb) : "rgba(255,255,255,0.4)";
          const bg = rgb ? rgbCss(rgb, 0.08) : "transparent";
          const border = rgb ? color : "rgba(255,255,255,0.15)";
          return (
            <span
              key={`pill-${wl}-${i}`}
              className="text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded border"
              style={{ color, borderColor: border, background: bg }}
            >
              {wl.toFixed(1)} nm
            </span>
          );
        })}
      </div>

      {invisibleLines.length > 0 && (
        <span className="text-[10px] font-mono text-white/35 italic">
          {invisibleLines.length === lines.length
            ? "—"
            : `(${invisibleLines.length} fora do visível)`}
        </span>
      )}
    </div>
  );
}
