"use client"

import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"
import { Menu, LogOut } from "lucide-react"
import { logout } from "@/app/actions"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Sidebar } from "./sidebar"
import { useState } from "react"

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/50 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20 shadow-sm">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 sm:max-w-xs">
              <Sidebar setSheetOpen={setOpen} />
            </SheetContent>
          </Sheet>
        </div>
        <Link href="/dashboard" className="flex items-center space-x-3 transition-opacity hover:opacity-90">
          <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-gradient-to-br from-primary to-primary-foreground/20 p-[1px]">
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-background/90 backdrop-blur-sm">
              <img src="/logo.png" alt="Logo" className="h-6 w-6 object-contain" />
            </div>
          </div>
          <span className="hidden font-bold sm:inline-block">Shelly's Campus</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="hidden md:flex md:items-center md:space-x-2 lg:space-x-4">
            <Button asChild variant="ghost" className="text-sm font-medium rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant="ghost" className="text-sm font-medium rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
              <Link href="/equipos">Equipos</Link>
            </Button>
            <Button asChild variant="ghost" className="text-sm font-medium rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
              <Link href="/personas">Personas</Link>
            </Button>
          </nav>
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => logout()}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Cerrar Sesión"
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Cerrar Sesión</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
