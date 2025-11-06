"use client"

import { Menu } from "lucide-react"
// import { button } from "@/components/ui/button"

interface HeaderProps {
  onMenuClick: () => void
  activeMenu: string
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 z-100 absolute top-0 right-0 w-full max-w-[82%]">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button  className="lg:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </button>
          {/* <div className="flex items-center gap-2">
            <Menu className="h-5 w-5 text-gray-600" />
            <h1 className="text-lg font-semibold text-gray-900">{activeMenu}</h1>
          </div> */}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">HANS HYUNDAI</span>
          <div className="flex gap-2">
            <button >
              <span className="sr-only">Notifications</span>📧
            </button>
            <button >
              <span className="sr-only">Settings</span>
              ⚙️
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
