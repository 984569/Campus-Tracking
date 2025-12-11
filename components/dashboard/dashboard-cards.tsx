import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Boxes, Users, CheckCircle, ArrowUpRight } from "lucide-react"

interface DashboardCardsProps {
  totalEquipment: number
  totalPeople: number
  assignedEquipment: number
}

export function DashboardCards({ totalEquipment, totalPeople, assignedEquipment }: DashboardCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="dashboard-card group relative overflow-hidden border-none bg-gradient-to-br from-blue-500/10 via-transparent to-transparent">
        <div className="absolute inset-0 bg-blue-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Equipos</CardTitle>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-500 shadow-lg shadow-blue-500/10 transition-transform group-hover:scale-110">
            <Boxes className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <div className="text-4xl font-bold tracking-tight text-foreground">{totalEquipment}</div>
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-500">+2.5%</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Equipos registrados en el sistema</p>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-blue-950/30">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: "70%" }} />
          </div>
        </CardContent>
      </Card>

      <Card className="dashboard-card group relative overflow-hidden border-none bg-gradient-to-br from-purple-500/10 via-transparent to-transparent">
        <div className="absolute inset-0 bg-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Personas</CardTitle>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-500 shadow-lg shadow-purple-500/10 transition-transform group-hover:scale-110">
            <Users className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <div className="text-4xl font-bold tracking-tight text-foreground">{totalPeople}</div>
            <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-500">+12%</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Personas registradas en el sistema</p>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-purple-950/30">
            <div className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: "45%" }} />
          </div>
        </CardContent>
      </Card>

      <Card className="dashboard-card group relative overflow-hidden border-none bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent">
        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Equipos Asignados</CardTitle>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500 shadow-lg shadow-emerald-500/10 transition-transform group-hover:scale-110">
            <CheckCircle className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <div className="text-4xl font-bold tracking-tight text-foreground">{assignedEquipment}</div>
            <span className="flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              {((assignedEquipment / totalEquipment) * 100 || 0).toFixed(1)}%
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Del total de equipos disponibles
          </p>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-emerald-950/30">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              style={{ width: `${(assignedEquipment / totalEquipment) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
