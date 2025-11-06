// components/DashboardContent.tsx
"use client"
import React from "react"
export default function DashboardContent({ children }) {
  return (
    <div className="ml-0 absolute right-0 top-20 p-4  bg-amber-200">
      {children}
    </div>
  )
}