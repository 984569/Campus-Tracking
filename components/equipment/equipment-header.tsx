import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export function EquipmentHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-1 animate-in fade-in slide-in-from-top-4 duration-500">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/50 bg-clip-text text-transparent drop-shadow-sm">
          Equipos
        </h1>
        <p className="text-muted-foreground mt-1 text-lg font-light tracking-wide">Gestiona el inventario de equipos informáticos</p>
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
