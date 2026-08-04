import type { RiskStatus } from '../types'

interface StatusBadgeProps {
  status: RiskStatus
}

const STATUS_COPY: Record<RiskStatus, string> = {
  Safe: 'Within account rules',
  'Approaching Limit': 'Getting close to a rule limit',
  'At Risk': 'High chance of a rule breach',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const slug = status.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`status-badge status-${slug}`} role="status">
      <span className="status-dot" aria-hidden="true" />
      <div>
        <p className="status-label">{status}</p>
        <p className="status-copy">{STATUS_COPY[status]}</p>
      </div>
    </div>
  )
}
