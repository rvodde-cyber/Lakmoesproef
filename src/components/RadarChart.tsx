import type { Pillar } from "../utils/assessment";

export function RadarChart({ pillars }: { pillars: Pillar[] }) {
  const size = 280;
  const center = size / 2;
  const maxRadius = 95;
  const steps = 5;
  const n = pillars.length;
  const angleStep = (Math.PI * 2) / n;

  const pointFor = (index: number, value: number) => {
    const angle = -Math.PI / 2 + index * angleStep;
    const radius = (value / 5) * maxRadius;
    return [center + Math.cos(angle) * radius, center + Math.sin(angle) * radius];
  };

  const polygonPoints = pillars
    .map((pillar, i) => pointFor(i, pillar.avg || 0))
    .map(([x, y]) => `${x},${y}`)
    .join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {[...Array(steps)].map((_, i) => {
        const r = ((i + 1) / steps) * maxRadius;
        const ringPoints = pillars
          .map((_, idx) => {
            const angle = -Math.PI / 2 + idx * angleStep;
            return `${center + Math.cos(angle) * r},${center + Math.sin(angle) * r}`;
          })
          .join(" ");
        return <polygon key={i} points={ringPoints} fill="none" stroke="#dbe2ea" strokeWidth="1" />;
      })}
      {pillars.map((pillar, i) => {
        const [x, y] = pointFor(i, 5);
        return (
          <g key={pillar.label}>
            <line x1={center} y1={center} x2={x} y2={y} stroke="#dbe2ea" />
            <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#475569">
              {pillar.label}
            </text>
          </g>
        );
      })}
      <polygon points={polygonPoints} fill="rgba(14,165,233,0.22)" stroke="#0ea5e9" strokeWidth="2" />
    </svg>
  );
}
