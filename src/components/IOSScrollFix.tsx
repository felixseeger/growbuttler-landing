'use client'

import { useEffect } from 'react'

export default function IOSScrollFix() {
  useEffect(() => {
    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

    if (!isIOS) return

    console.log('[iOS Scroll Fix] Detected iOS, applying fixes...')

    // Override CSS that's preventing scroll
    const style = document.createElement('style')
    style.textContent = `
      html {
        position: relative !important;
        overflow: visible !important;
        height: auto !important;
      }

      body {
        position: relative !important;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
        height: auto !important;
        min-height: 100vh !important;
      }

      main, [class*="main"], [class*="content"] {
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
        height: auto !important;
        min-height: 0 !important;
      }

      /* Allow touch events */
      * {
        -webkit-overflow-scrolling: touch !important;
      }
    `
    document.head.appendChild(style)

    // Force body to be scrollable
    document.body.style.touchAction = 'pan-y'

    console.log('[iOS Scroll Fix] Applied')

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return null
}
