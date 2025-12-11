import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-in fade-in slide-in-from-top-4 duration-500">
      <div>
        <h1 className="section-title">Dashboard</h1>
        <p className="section-description mt-1">Resumen del inventario y actividad reciente</p>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25 border-0 transition-all duration-300 hover:scale-105 hover:shadow-primary/40">
          <Link href="/equipos/nuevo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Equipo
          </Link>
        </Button>
      </div>
    </div>
  )
}
