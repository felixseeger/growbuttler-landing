'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface SidebarContextType {
  isCollapsed: boolean
  toggleCollapse: () => void
  setIsCollapsed: (value: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Load preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved !== null) {
      setIsCollapsed(saved === 'true')
    }
  }, [])

  const toggleCollapse = () => {
    const newValue = !isCollapsed
    setIsCollapsed(newValue)
    localStorage.setItem('sidebar-collapsed', String(newValue))
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleCollapse, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
