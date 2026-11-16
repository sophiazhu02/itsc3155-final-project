type Props = {
  /** "light" for white/light backgrounds, "dark" for dark backgrounds */
  variant?: 'light' | 'dark'
  /** Show the "careersquare" wordmark next to the mark */
  wordmark?: boolean
  /** Height of the bracket mark in pixels */
  size?: number
}

export function LogoMark({ variant = 'light', size = 28 }: Pick<Props, 'variant' | 'size'>) {
  const topLeft = variant === 'dark' ? '#ffffff' : 'var(--brand-navy)'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 310 310"
      fill="none"
      strokeWidth="50"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M25 192V65a40 40 0 0 1 40-40h126" stroke={topLeft} />
      <path d="M285 119v126a40 40 0 0 1-40 40H119" stroke="var(--brand-accent)" />
    </svg>
  )
}

export default function Logo({ variant = 'light', wordmark = true, size = 28 }: Props) {
  return (
    <span className={`logo logo-${variant}`}>
      <LogoMark variant={variant} size={size} />
      {wordmark && (
        <span className="logo-wordmark" style={{ fontSize: size * 0.75 }}>
          career<span className="logo-accent">square</span>
        </span>
      )}
    </span>
  )
}
