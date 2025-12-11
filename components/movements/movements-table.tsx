"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDateTime } from "@/lib/utils"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { DeleteButton } from "@/components/delete-button"
import { EditButton } from "@/components/edit-button"
import { MovementBadge } from "./movement-badge"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

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

interface MovementsTableProps {
  movements: Movement[]
  pageCount: number
  currentPage: number
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

export function MovementsTable({ movements, pageCount, currentPage }: MovementsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedTipo, setSelectedTipo] = useState(searchParams.get("tipo") || "")

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", "1") // Reset to first page on filter change

    if (value) {
      params.set(name, value)
    } else {
      params.delete(name)
    }

    return params.toString()
  }

  const handleTipoChange = (value: string) => {
    setSelectedTipo(value)
    router.push(`/movimientos?${createQueryString("tipo", value)}`)
  }

  const clearFilters = () => {
    setSelectedTipo("")
    router.push("/movimientos")
  }

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`/movimientos?${params.toString()}`)
  }

  const handleDelete = () => {
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="flex gap-3">
          <Select value={selectedTipo} onValueChange={handleTipoChange}>
            <SelectTrigger className="w-[180px] bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 h-10 rounded-xl">
              <SelectValue placeholder="Tipo de Movimiento" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10 backdrop-blur-xl">
              <SelectItem value="all">Todos los tipos</SelectItem>
              {tiposMovimiento.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedTipo && (
            <Button variant="ghost" onClick={clearFilters} size="icon" className="h-10 w-10 rounded-xl hover:bg-white/10 hover:text-destructive transition-colors">
              <X className="h-5 w-5" />
              <span className="sr-only">Limpiar filtros</span>
            </Button>
          )}
        </div>
      </div>

      <Card className="dashboard-card border-none bg-gradient-to-b from-white/5 to-transparent">
        <CardContent className="p-0">
          <div className="rounded-xl border border-white/5 bg-black/20 overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-medium">Fecha</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Equipo</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Tipo</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Persona</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Detalles</TableHead>
                  <TableHead className="w-[120px] text-muted-foreground font-medium">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.length > 0 ? (
                  movements.map((movement, index) => (
                    <motion.tr
                      key={movement.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="group border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <TableCell className="whitespace-nowrap">
                        <Link href={`/movimientos/${movement.id}`} className="hover:text-primary transition-colors text-muted-foreground">
                          {formatDateTime(movement.fecha_movimiento)}
                        </Link>
                      </TableCell>
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
                      <TableCell>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <EditButton id={movement.id} type="movimiento" />
                          <DeleteButton
                            id={movement.id}
                            type="movimiento"
                            name={`Movimiento de ${movement.equipo_codigo}`}
                            onDelete={handleDelete}
                            equipoId={movement.equipo_id}
                          />
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <X className="h-8 w-8 opacity-50" />
                        <p>No se encontraron movimientos</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {pageCount > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-primary disabled:opacity-30 rounded-xl"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Página anterior</span>
          </Button>
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
            {Array.from({ length: pageCount }).map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "ghost"}
                size="icon"
                onClick={() => goToPage(i + 1)}
                className={currentPage === i + 1
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 rounded-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-lg"
                }
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === pageCount}
            className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-primary disabled:opacity-30 rounded-xl"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Página siguiente</span>
          </Button>
        </div>
      )}
    </div>
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
