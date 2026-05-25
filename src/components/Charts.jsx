import React from "react";

export function DynamicsChart({ points }) {
  const width = 600;
  const height = 220;
  const max = 10;
  const step = width / (points.length - 1);
  const toPath = (key) =>
    points
      .map((point, index) => {
        const x = index * step;
        const y = height - 24 - (point[key] / max) * 160;
        return `${index === 0 ? "M" : "L"} ${x + 24} ${y}`;
      })
      .join(" ");

  return (
    <div className="chart" aria-label="График динамики">
      <svg viewBox={`0 0 ${width + 48} ${height}`} role="img">
        <path d={toPath("resource")} fill="none" stroke="var(--blue)" strokeLinecap="round" strokeWidth="6" />
        <path d={toPath("problem")} fill="none" stroke="var(--orange)" strokeLinecap="round" strokeWidth="6" />
        {points.map((point, index) => (
          <g key={point.date}>
            <circle cx={index * step + 24} cy={height - 24 - (point.resource / max) * 160} fill="var(--blue)" r="5" />
            <circle cx={index * step + 24} cy={height - 24 - (point.problem / max) * 160} fill="var(--orange)" r="5" />
            <text x={index * step + 24} y="208" textAnchor="middle">{point.date}</text>
          </g>
        ))}
      </svg>
      <div className="legend">
        <span><i className="legend-dot blue-dot" /> Ресурс</span>
        <span><i className="legend-dot orange-dot" /> Сила проблемы</span>
      </div>
    </div>
  );
}

export function ThemeBars({ items }) {
  return (
    <div className="theme-bars">
      {items.map((item) => (
        <div key={item.label}>
          <div className="bar-head">
            <span>{item.label}</span>
            <strong>{item.value}%</strong>
          </div>
          <div className="bar"><i style={{ width: `${item.value}%` }} /></div>
        </div>
      ))}
    </div>
  );
}
