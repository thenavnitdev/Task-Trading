export function formatCurrency(
  value: number,
  options: { signed?: boolean; digits?: number } = {},
): string {
  const { signed = false, digits = 0 } = options
  const absolute = Math.abs(value).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })

  if (signed) {
    if (value > 0) return `+${absolute}`
    if (value < 0) return `-${absolute}`
    return absolute
  }

  return value < 0 ? `-${absolute}` : absolute
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`
}

export function pnlClass(value: number): string {
  if (value > 0) return 'positive'
  if (value < 0) return 'negative'
  return 'neutral'
}
