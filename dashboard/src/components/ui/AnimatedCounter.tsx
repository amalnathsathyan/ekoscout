import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Props for the AnimatedCounter component.
 */
interface AnimatedCounterProps {
  /** Target numeric value to animate towards */
  value: number
  /** Animation duration in milliseconds (default: 2000) */
  duration?: number
  /** Optional prefix displayed before the number (e.g. '$') */
  prefix?: string
  /** Optional suffix displayed after the number */
  suffix?: string
  /** Number of decimal places to display (default: 0) */
  decimals?: number
  /** Additional CSS classes for the wrapper span */
  className?: string
}

/**
 * AnimatedCounter — smoothly animates a numeric value from 0 to its target.
 *
 * Uses `requestAnimationFrame` for buttery-smooth 60fps counting with an
 * ease-out cubic easing curve: `1 - (1 - t)^3`. Automatically restarts
 * the animation whenever `value` changes and cleans up on unmount.
 *
 * @example
 * ```tsx
 * <AnimatedCounter value={1_250_000} prefix="$" suffix=" TVL" />
 * ```
 */
export default function AnimatedCounter({
  value,
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const startValueRef = useRef(0)

  /**
   * Ease-out cubic: decelerates towards the end for a natural feel.
   * f(t) = 1 - (1 - t)^3
   */
  const easeOutCubic = useCallback((t: number): number => {
    return 1 - Math.pow(1 - t, 3)
  }, [])

  useEffect(() => {
    // Capture the current display value as the animation start point
    startValueRef.current = displayValue
    startTimeRef.current = null

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutCubic(progress)

      // Interpolate between the starting value and target value
      const current =
        startValueRef.current + (value - startValueRef.current) * easedProgress

      setDisplayValue(current)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
    // We intentionally exclude displayValue from deps to avoid restart loops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, easeOutCubic])

  /**
   * Format the current counter value with locale-aware commas and the
   * requested number of decimal places.
   */
  const formattedValue = displayValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  )
}
