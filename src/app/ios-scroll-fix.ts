'use client'

/**
 * iOS Scroll Fix
 * Forces proper scroll behavior on iOS WebView/Capacitor
 */
export function initIOSScrollFix() {
  if (typeof window === 'undefined') return

  // Detect iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

  if (!isIOS) return

  // Remove position: fixed from html to allow body scroll
  document.documentElement.style.position = 'relative'
  document.documentElement.style.overflow = 'visible'

  // Ensure body can scroll
  document.body.style.overflow = 'auto'
  document.body.style.webkitOverflowScrolling = 'touch'
  document.body.style.height = 'auto'
  document.body.style.minHeight = '100vh'

  // Force all containers to allow scrolling
  const forceScroll = () => {
    const scrollContainers = document.querySelectorAll('main, [class*="content"], [class*="main"]')
    scrollContainers.forEach((el) => {
      const element = el as HTMLElement
      element.style.webkitOverflowScrolling = 'touch'
      element.style.overflowY = 'auto'
      element.style.height = 'auto'
      element.style.minHeight = '0'
    })
  }

  // Apply immediately and after DOM changes
  forceScroll()
  setTimeout(forceScroll, 100)
  setTimeout(forceScroll, 500)

  // Re-apply on route changes
  if ('navigation' in window) {
    window.addEventListener('popstate', forceScroll)
  }

  console.log('[iOS Scroll Fix] Applied')
}
