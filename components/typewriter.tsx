'use client'

import { useState, useEffect, useRef } from 'react'

interface TypewriterProps {
  text: string
  speed?: number
  onComplete?: () => void
  isActive?: boolean
}

export function Typewriter({ 
  text, 
  speed = 15, 
  onComplete,
  isActive = true 
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const prevTextRef = useRef('')
  const indexRef = useRef(0)

  useEffect(() => {
    if (!isActive) {
      setDisplayedText(text)
      setIsComplete(true)
      return
    }

    if (text !== prevTextRef.current) {
      if (text.startsWith(prevTextRef.current)) {
        indexRef.current = prevTextRef.current.length
      } else {
        indexRef.current = 0
        setDisplayedText('')
      }
      prevTextRef.current = text
      setIsComplete(false)
    }

    if (indexRef.current >= text.length) {
      if (!isComplete) {
        setIsComplete(true)
        onComplete?.()
      }
      return
    }

    const timer = setTimeout(() => {
      const charsToAdd = Math.min(3, text.length - indexRef.current)
      setDisplayedText(text.slice(0, indexRef.current + charsToAdd))
      indexRef.current += charsToAdd
    }, speed)

    return () => clearTimeout(timer)
  }, [text, displayedText, speed, onComplete, isActive, isComplete])

  return <>{displayedText}</>
}
