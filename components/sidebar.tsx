"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Boxes, ClipboardList, LayoutDashboard, Users } from "lucide-react"

interface SidebarProps {
  setSheetOpen?: (open: boolean) => void
}

export function Sidebar({ setSheetOpen }: SidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Equipos",
      icon: Boxes,
      href: "/equipos",
      active: pathname.startsWith("/equipos"),
    },
    {
      label: "Personas",
      icon: Users,
      href: "/personas",
      active: pathname.startsWith("/personas"),
    },
    {
      label: "Movimientos",
      icon: ClipboardList,
      href: "/movimientos",
      active: pathname.startsWith("/movimientos"),
    },
    {
      label: "Reportes",
      icon: BarChart3,
      href: "/reportes",
      active: pathname.startsWith("/reportes"),
    },
  ]

  const handleClick = () => {
    if (setSheetOpen) {
      setSheetOpen(false)
    }
  }

  return (
    <nav className="hidden md:block min-h-screen w-64 border-r border-white/5 bg-background/30 backdrop-blur-xl p-6">
      <div className="mt-4 space-y-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            onClick={handleClick}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
              route.active
                ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground hover:translate-x-1 hover:shadow-lg hover:shadow-black/5",
            )}
          >
            <route.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", route.active ? "text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "text-muted-foreground group-hover:text-foreground")} />
            {route.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
