"use client"

import { useEffect, useRef, useState } from "react"

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function useCountUp(
  target: number,
  duration: number = 1200,
  decimals: number = 0
): string {
  const [value, setValue] = useState(0)
  const frameRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)
  const previousTargetRef = useRef<number>(0)

  useEffect(() => {
    const startValue = previousTargetRef.current
    previousTargetRef.current = target
    startTimeRef.current = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutCubic(progress)
      const currentValue = startValue + (target - startValue) * easedProgress

      setValue(currentValue)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [target, duration])

  return value.toFixed(decimals)
}
