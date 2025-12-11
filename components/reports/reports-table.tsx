import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDateTime } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Movement {
  id: string
  equipo_id: string
  equipo_codigo: string
  equipo_nombre: string
  tipo_movimiento: string
  fecha_movimiento: string
  persona_id?: string
  persona_nombre?: string
  persona_apellido?: string
  persona_origen_id?: string
  persona_origen_nombre?: string
  persona_origen_apellido?: string
  persona_destino_id?: string
  persona_destino_nombre?: string
  persona_destino_apellido?: string
  notas?: string
}

interface ReportsTableProps {
  movements: Movement[]
}

export function ReportsTable({ movements }: ReportsTableProps) {
  return (
    <Card className="dashboard-card border-none bg-gradient-to-b from-white/5 to-transparent">
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight">Movimientos Recientes</CardTitle>
        <CardDescription className="text-muted-foreground">Los últimos 10 movimientos registrados en el sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-white/5 bg-black/20 overflow-hidden">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium">Fecha</TableHead>
                <TableHead className="text-muted-foreground font-medium">Equipo</TableHead>
                <TableHead className="text-muted-foreground font-medium">Tipo</TableHead>
                <TableHead className="text-muted-foreground font-medium">Persona</TableHead>
                <TableHead className="text-muted-foreground font-medium">Detalles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.length > 0 ? (
                movements.map((movement) => (
                  <TableRow key={movement.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="whitespace-nowrap text-muted-foreground">{formatDateTime(movement.fecha_movimiento)}</TableCell>
                    <TableCell>
                      <Link href={`/equipos/${movement.equipo_id}`} className="font-medium hover:text-primary transition-colors text-foreground">
                        {movement.equipo_codigo} - {movement.equipo_nombre}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <MovementBadge type={movement.tipo_movimiento} />
                    </TableCell>
                    <TableCell className="text-foreground/90">{getPersonaDisplay(movement)}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">{movement.notas || "Sin detalles"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No hay movimientos registrados
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

function getPersonaDisplay(movement: Movement): React.ReactNode {
  switch (movement.tipo_movimiento) {
    case "Entrada":
      return "N/A"
    case "Salida":
      if (movement.persona_nombre) {
        return (
          <Link href={`/personas/${movement.persona_id}`} className="hover:text-primary transition-colors">
            {`${movement.persona_nombre} ${movement.persona_apellido}`}
          </Link>
        )
      }
      return "N/A"
    case "Transferencia":
      return (
        <div>
          <div>
            <span className="text-xs text-muted-foreground">De: </span>
            {movement.persona_origen_nombre ? (
              <Link href={`/personas/${movement.persona_origen_id}`} className="hover:text-primary transition-colors">
                {`${movement.persona_origen_nombre} ${movement.persona_origen_apellido}`}
              </Link>
            ) : (
              "N/A"
            )}
          </div>
          <div>
            <span className="text-xs text-muted-foreground">A: </span>
            {movement.persona_destino_nombre ? (
              <Link href={`/personas/${movement.persona_destino_id}`} className="hover:text-primary transition-colors">
                {`${movement.persona_destino_nombre} ${movement.persona_destino_apellido}`}
              </Link>
            ) : (
              "N/A"
            )}
          </div>
        </div>
      )
    default:
      return "N/A"
  }
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
