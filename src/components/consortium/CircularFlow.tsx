import React from "react";
import { Users, Monitor, LineChart } from "lucide-react";

// Circular segmented flow with precise gaps, arcs, and tangential arrows
// viewBox 0 0 1200 700, center (600,380), radius 260
const CircularFlow: React.FC = () => {
  const width = 1200;
  const height = 700;
  const cx = 600;
  const cy = 380;
  const r = 260;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const polarToCartesian = (angleDeg: number, radius = r) => {
    const rad = toRad(angleDeg);
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  // sweep = 1 (clockwise). large-arc-flag computed by delta angle (>180)
  const arcPath = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(endAngle);
    const delta = (endAngle - startAngle + 360) % 360;
    const largeArcFlag = delta > 180 ? 1 : 0;
    return `M ${start.x.toFixed(3)} ${start.y.toFixed(3)} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`;
  };

  // Arrow helper: small 12x8 triangle, tip 2px outside the circumference, aligned to tangent
  const Arrow = ({ angle }: { angle: number }) => {
    const tip = polarToCartesian(angle, r + 2); // tip slightly outside
    const tangentAngle = angle + 90; // clockwise tangent direction
    return (
      <g transform={`translate(${tip.x} ${tip.y}) rotate(${tangentAngle})`} className="text-secondary">
        {/* Triangle pointing along +X in local space */}
        <polygon points="0,0 -12,4 -12,-4" fill="currentColor" />
      </g>
    );
  };

  // Icon block helper (uses nested SVG icons from lucide-react)
  const IconWithLabel = ({
    x,
    y,
    labelLines,
    children,
  }: {
    x: number;
    y: number;
    labelLines: string[];
    children: React.ReactNode;
  }) => {
    const iconSize = 64;
    const labelSpacing = 12;
    const labelY = y + iconSize / 2 + labelSpacing;

    return (
      <g className="text-secondary">
        {/* Icon centered at (x,y) */}
        <g transform={`translate(${x - iconSize / 2} ${y - iconSize / 2})`}>
          {children}
        </g>
        {/* Label text */}
        <text
          x={x}
          y={labelY}
          textAnchor="middle"
          fill="currentColor"
          fillOpacity={0.85}
          style={{ fontSize: 30, fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, "Helvetica Neue", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' }}
        >
          {labelLines.map((line, idx) => (
            <tspan key={idx} x={x} dy={idx === 0 ? 0 : 36}>
              {line}
            </tspan>
          ))}
        </text>
      </g>
    );
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="auto"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Arcs (A, B, C) with consistent stroke */}
      <g strokeLinecap="round" fill="none" className="text-secondary">
        <path d={arcPath(282, 308)} stroke="currentColor" strokeWidth={3} />
        <path d={arcPath(332, 208)} stroke="currentColor" strokeWidth={3} />
        <path d={arcPath(232, 258)} stroke="currentColor" strokeWidth={3} />
      </g>

      {/* Tangential arrows at the ends of arcs: 308°, 208°, 258° */}
      <Arrow angle={308} />
      <Arrow angle={208} />
      <Arrow angle={258} />

      {/* Icons and labels */}
      <IconWithLabel x={600} y={140} labelLines={["Grupo"]}>
        <Users width={64} height={64} color="currentColor" strokeWidth={1.75} />
      </IconWithLabel>

      <IconWithLabel x={240} y={470} labelLines={["Administradora"]}>
        <Monitor width={64} height={64} color="currentColor" strokeWidth={1.75} />
      </IconWithLabel>

      <IconWithLabel x={960} y={470} labelLines={["Índice de", "Contemplação"]}>
        <LineChart width={64} height={64} color="currentColor" strokeWidth={1.75} />
      </IconWithLabel>
    </svg>
  );
};

export default CircularFlow;
