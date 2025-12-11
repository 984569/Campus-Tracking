"use client"

import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDateTime } from "@/lib/utils"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts"
import { MovementBadge } from "../movements/movement-badge"

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

interface ReportsMovementsByTypeProps {
  movements: Movement[]
  selectedTipo: string
}

const tiposMovimiento = [
  "Entrada",
  "Salida",
  "Transferencia",
  "Mantenimiento",
  "Baja",
  "Préstamo",
  "Devolución préstamo",
  "Devolución egreso",
]

// Paleta de colores profesional
const COLORS = ["#3498DB", "#2ECC71", "#9B59B6", "#F1C40F", "#E74C3C", "#1ABC9C", "#34495E", "#D35400"]

export function ReportsMovementsByType({ movements, selectedTipo }: ReportsMovementsByTypeProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Preparar datos para el gráfico
  const movementsByType = tiposMovimiento
    .map((tipo) => {
      const count = movements.filter((item) => item.tipo_movimiento === tipo).length
      return {
        name: tipo,
        value: count,
      }
    })
    .filter((item) => item.value > 0)

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(name, value)
    } else {
      params.delete(name)
    }

    return params.toString()
  }

  const handleTipoChange = (value: string) => {
    router.push(`/reportes?${createQueryString("tipoMovimiento", value)}`)
  }

  const clearFilter = () => {
    router.push(`/reportes?${createQueryString("tipoMovimiento", "")}`)
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl">Movimientos por Tipo</CardTitle>
          <CardDescription>
            {selectedTipo
              ? `Mostrando movimientos de tipo: ${selectedTipo}`
              : "Selecciona un tipo para filtrar los movimientos"}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedTipo} onValueChange={handleTipoChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              {tiposMovimiento.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedTipo && (
            <Button variant="ghost" size="icon" onClick={clearFilter}>
              <X className="h-4 w-4" />
              <span className="sr-only">Limpiar filtro</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!selectedTipo && (
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={movementsByType}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
                barSize={36}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#E0E0E0" }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis tickLine={false} axisLine={{ stroke: "#E0E0E0" }} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [`${value} movimientos`, "Cantidad"]}
                  contentStyle={{ borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
                />
                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                <Bar dataKey="value" name="Cantidad" radius={[4, 4, 0, 0]}>
                  {movementsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  <LabelList dataKey="value" position="top" fill="#666" fontSize={12} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Equipo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Persona</TableHead>
              <TableHead>Detalles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.length > 0 ? (
              movements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell className="whitespace-nowrap">
                    <Link href={`/movimientos/${movement.id}`} className="hover:underline">
                      {formatDateTime(movement.fecha_movimiento)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/equipos/${movement.equipo_id}`} className="font-medium hover:underline">
                      {movement.equipo_codigo} - {movement.equipo_nombre}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <MovementBadge type={movement.tipo_movimiento} />
                  </TableCell>
                  <TableCell>{getPersonaDisplay(movement)}</TableCell>
                  <TableCell className="max-w-xs truncate">{movement.notas || "Sin detalles"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  {selectedTipo ? "No hay movimientos de este tipo" : "Selecciona un tipo para ver los movimientos"}
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
    case "Mantenimiento":
    case "Baja":
      return "N/A"
    case "Salida":
    case "Préstamo":
      if (movement.persona_nombre) {
        return (
          <Link href={`/personas/${movement.persona_id}`} className="hover:underline">
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
              <Link href={`/personas/${movement.persona_origen_id}`} className="hover:underline">
                {`${movement.persona_origen_nombre} ${movement.persona_origen_apellido}`}
              </Link>
            ) : (
              "N/A"
            )}
          </div>
          <div>
            <span className="text-xs text-muted-foreground">A: </span>
            {movement.persona_destino_nombre ? (
              <Link href={`/personas/${movement.persona_destino_id}`} className="hover:underline">
                {`${movement.persona_destino_nombre} ${movement.persona_destino_apellido}`}
              </Link>
            ) : (
              "N/A"
            )}
          </div>
        </div>
      )
    case "Devolución préstamo":
    case "Devolución egreso":
      return movement.persona_origen_nombre ? (
        <Link href={`/personas/${movement.persona_origen_id}`} className="hover:underline">
          {`${movement.persona_origen_nombre} ${movement.persona_origen_apellido}`}
        </Link>
      ) : (
        "N/A"
      )
    default:
      return "N/A"
  }
}
