import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Movement {
  id: string
  equipo_codigo: string
  equipo_nombre: string
  tipo_movimiento: string
  fecha_movimiento: string
  persona_nombre?: string
  persona_apellido?: string
}

interface DashboardRecentMovementsProps {
  movements: Movement[]
}

export function DashboardRecentMovements({ movements }: DashboardRecentMovementsProps) {
  return (
    <Card className="dashboard-card border-none bg-gradient-to-b from-white/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold tracking-tight">Movimientos Recientes</CardTitle>
        <CardDescription className="text-muted-foreground/80">Los últimos 5 movimientos registrados en el sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-white/5 bg-black/20 overflow-hidden">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Fecha</TableHead>
                <TableHead className="text-muted-foreground">Equipo</TableHead>
                <TableHead className="text-muted-foreground">Tipo</TableHead>
                <TableHead className="text-muted-foreground">Persona</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.length > 0 ? (
                movements.map((movement, index) => (
                  <TableRow key={movement.id} className="border-white/5 hover:bg-white/5 transition-colors duration-200">
                    <TableCell className="font-medium text-foreground/80">{formatDate(movement.fecha_movimiento)}</TableCell>
                    <TableCell>
                      <Link href={`/equipos/${movement.equipo_codigo}`} className="font-medium hover:text-primary transition-colors text-foreground">
                        {movement.equipo_codigo} - {movement.equipo_nombre}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <MovementBadge type={movement.tipo_movimiento} />
                    </TableCell>
                    <TableCell className="text-foreground/80">
                      {movement.persona_nombre ? `${movement.persona_nombre} ${movement.persona_apellido}` : "N/A"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No hay movimientos recientes
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

function MovementBadge({ type }: { type: string }) {
  let className = "border-transparent font-medium"

  switch (type) {
    case "Entrada":
      className += " bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20"
      break
    case "Salida":
      className += " bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20"
      break
    case "Transferencia":
      className += " bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/20"
      break
    case "Mantenimiento":
      className += " bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20"
      break
    case "Baja":
      className += " bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"
      break
    default:
      className += " bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 border-gray-500/20"
  }

  return (
    <Badge variant="outline" className={className}>
      {type}
    </Badge>
  )
}
