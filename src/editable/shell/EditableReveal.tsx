'use client'

import { createElement, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type EditableRevealTag =
  | 'div'
  | 'section'
  | 'article'
  | 'header'
  | 'footer'
  | 'span'
  | 'li'
  | 'ul'
  | 'ol'

type EditableRevealProps = {
  children: ReactNode
  /** Stagger index (0-based). Adds ~60ms per index up to a cap. */
  index?: number
  /** Custom delay in ms (overrides index-derived value). */
  delayMs?: number
  /** Wrapping element tag. Defaults to div. */
  as?: EditableRevealTag
  className?: string
  style?: CSSProperties
  /** Root margin passed to the observer (e.g. '0px 0px -10% 0px'). */
  rootMargin?: string
  /** One-shot reveal (default true). */
  once?: boolean
}

const clampStagger = (i: number) => Math.min(Math.max(i, 0), 12) * 60

export function EditableReveal({
  children,
  index = 0,
  delayMs,
  as = 'div',
  className = '',
  style,
  rootMargin = '0px 0px -8% 0px',
  once = true,
}: EditableRevealProps) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  // Hidden state applied only after mount so JS-off visitors see content.
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) io.disconnect()
          } else if (!once) {
            setVisible(false)
          }
        })
      },
      { rootMargin, threshold: 0.08 }
    )
    io.observe(node)
    return () => io.disconnect()
  }, [mounted, once, rootMargin])

  const transitionDelay = `${delayMs ?? clampStagger(index)}ms`
  const isHidden = mounted && !visible
  const mergedStyle: CSSProperties = { transitionDelay, ...(style || {}) }

  const setRef = useCallback((node: HTMLElement | null) => {
    ref.current = node
  }, [])

  /* eslint-disable react-hooks/refs */
  return createElement(
    as,
    {
      ref: setRef,
      className: `editable-reveal ${visible ? 'is-visible' : ''} ${className}`.trim(),
      style: mergedStyle,
      'data-hidden': isHidden ? 'true' : undefined,
    },
    children
  )
  /* eslint-enable react-hooks/refs */
}
