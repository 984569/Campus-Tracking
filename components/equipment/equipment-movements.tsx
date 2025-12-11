import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDateTime } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Movement {
  id: string
  tipo_movimiento: string
  fecha_movimiento: string
  persona_nombre?: string
  persona_apellido?: string
  persona_origen_nombre?: string
  persona_origen_apellido?: string
  persona_destino_nombre?: string
  persona_destino_apellido?: string
  notas?: string
}

interface EquipmentMovementsProps {
  movements: Movement[]
}

export function EquipmentMovements({ movements }: EquipmentMovementsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Movimientos</CardTitle>
        <CardDescription>Registro de todos los movimientos de este equipo</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Persona</TableHead>
              <TableHead>Detalles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.length > 0 ? (
              movements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell className="whitespace-nowrap">{formatDateTime(movement.fecha_movimiento)}</TableCell>
                  <TableCell>
                    <MovementBadge type={movement.tipo_movimiento} />
                  </TableCell>
                  <TableCell>{getPersonaDisplay(movement)}</TableCell>
                  <TableCell className="max-w-xs truncate">{movement.notas || "Sin detalles"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No hay movimientos registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
          <Link href={`/personas/${movement.id}`} className="hover:underline">
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
            {movement.persona_origen_nombre
              ? `${movement.persona_origen_nombre} ${movement.persona_origen_apellido}`
              : "N/A"}
          </div>
          <div>
            <span className="text-xs text-muted-foreground">A: </span>
            {movement.persona_destino_nombre
              ? `${movement.persona_destino_nombre} ${movement.persona_destino_apellido}`
              : "N/A"}
          </div>
        </div>
      )
    default:
      return "N/A"
  }
}

function MovementBadge({ type }: { type: string }) {
  let variant: "default" | "secondary" | "destructive" | "outline" | null | undefined = "default"

  switch (type) {
    case "Entrada":
      variant = "default"
      break
    case "Salida":
      variant = "secondary"
      break
    case "Transferencia":
      variant = "outline"
      break
    case "Mantenimiento":
      variant = "secondary"
      break
    case "Baja":
      variant = "destructive"
      break
  }

  return <Badge variant={variant}>{type}</Badge>
}
