export function DynamicsChart({ points }: { points: Array<{ key: string; label: string; problem: number; resource: number }> }) {
  return (
    <div className="mini-chart" aria-label="Динамика состояния">
      {points.map((point) => (
        <div className="chart-point" key={point.key}>
          <div className="bar problem" style={{ height: `${point.problem * 9}%` }} />
          <div className="bar resource" style={{ height: `${point.resource * 9}%` }} />
          <span>{point.label}</span>
        </div>
      ))}
    </div>
  )
}

export function ThemeBars({ items }: { items: Array<{ label: string; value: number }> }) {
  return (
    <div className="theme-bars">
      {items.map((item) => (
        <div className="theme-bar" key={item.label}>
          <span>{item.label}</span>
          <div>
            <i style={{ width: `${item.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}
