import type { ReactNode } from 'react'

interface MetricCardProps {
  label: string
  value: ReactNode
  hint?: string
  tone?: 'default' | 'positive' | 'negative' | 'warning'
}

export function MetricCard({
  label,
  value,
  hint,
  tone = 'default',
}: MetricCardProps) {
  return (
    <article className={`metric-card tone-${tone}`}>
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
      {hint ? <p className="metric-hint">{hint}</p> : null}
    </article>
  )
}
