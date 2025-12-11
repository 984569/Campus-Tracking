"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { EquipmentWithAssignment } from "@/lib/supabase/schema"
import { formatDate } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { DeleteButton } from "@/components/delete-button"
import { EditButton } from "@/components/edit-button"
import { supabase } from "@/lib/supabase/client"
import { motion } from "framer-motion"

interface EquipmentTableProps {
  equipment: EquipmentWithAssignment[]
  pageCount: number
  currentPage: number
  tipos: string[]
  estados: string[]
}

export function EquipmentTable({ equipment, pageCount, currentPage, tipos, estados }: EquipmentTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [equipmentData, setEquipmentData] = useState<EquipmentWithAssignment[]>(equipment)

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [selectedEstado, setSelectedEstado] = useState(searchParams.get("estado") || "")
  const [selectedTipo, setSelectedTipo] = useState(searchParams.get("tipo") || "")

  // Actualizar el estado local cuando cambian los props
  useEffect(() => {
    setEquipmentData(equipment)
  }, [equipment])

  // Función para verificar y corregir inconsistencias en el estado de los equipos
  const verifyEquipmentState = async (equipoId: string) => {
    try {
      // Obtener el equipo
      const { data: equipo } = await supabase.from("equipos").select("*").eq("id", equipoId).single()

      if (!equipo) return

      // Obtener el último movimiento
      const { data: lastMovement } = await supabase
        .from("movimientos")
        .select("*")
        .eq("equipo_id", equipoId)
        .order("fecha_movimiento", { ascending: false })
        .limit(1)
        .single()

      let correctState = "Disponible"

      if (lastMovement) {
        switch (lastMovement.tipo_movimiento) {
          case "Entrada":
            correctState = "Disponible"
            break
          case "Salida":
            correctState = "Asignado"
            break
          case "Transferencia":
            correctState = "Asignado"
            break
          case "Mantenimiento":
            correctState = "En mantenimiento"
            break
          case "Baja":
            correctState = "Dado de baja"
            break
          case "Préstamo":
            correctState = "Asignado"
            break
          case "Devolución préstamo":
            correctState = "Disponible"
            break
          case "Devolución egreso":
            correctState = "Disponible"
            break
        }
      }

      // Si el estado actual es incorrecto, corregirlo
      if (equipo.estado !== correctState) {
        await supabase.from("equipos").update({ estado: correctState }).eq("id", equipoId)
        console.log(`Corregido estado de equipo ${equipo.codigo} de ${equipo.estado} a ${correctState}`)
      }
    } catch (error) {
      console.error("Error al verificar estado del equipo:", error)
    }
  }

  // Añadir la función handleDelete dentro del componente EquipmentTable
  const handleDelete = async () => {
    // Refrescar los datos después de eliminar
    router.refresh()
  }

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/equipos?${createQueryString("search", searchTerm)}`)
  }

  const handleEstadoChange = (value: string) => {
    setSelectedEstado(value)
    router.push(`/equipos?${createQueryString("estado", value)}`)
  }

  const handleTipoChange = (value: string) => {
    setSelectedTipo(value)
    router.push(`/equipos?${createQueryString("tipo", value)}`)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedEstado("")
    setSelectedTipo("")
    router.push("/equipos")
  }

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`/equipos?${params.toString()}`)
  }

  // Verificar inconsistencias al cargar el componente
  useEffect(() => {
    const checkInconsistencies = async () => {
      for (const item of equipmentData) {
        // Si está asignado pero no tiene persona asignada, verificar
        if (item.estado === "Asignado" && !item.persona) {
          await verifyEquipmentState(item.id)
        }
      }
    }

    checkInconsistencies()
  }, [equipmentData])

  return (
    <div className="space-y-6">
      <Card className="dashboard-card border-none bg-gradient-to-b from-white/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative group">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="search"
                  placeholder="Buscar por código, nombre o número de serie..."
                  className="pl-10 w-full bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all h-10 rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
            <div className="flex gap-3">
              <Select value={selectedEstado} onValueChange={handleEstadoChange}>
                <SelectTrigger className="w-[180px] bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 h-10 rounded-xl">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/10 backdrop-blur-xl">
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {estados.map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedTipo} onValueChange={handleTipoChange}>
                <SelectTrigger className="w-[180px] bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 h-10 rounded-xl">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/10 backdrop-blur-xl">
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {tipos.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(searchTerm || selectedEstado || selectedTipo) && (
                <Button variant="ghost" onClick={clearFilters} size="icon" className="h-10 w-10 rounded-xl hover:bg-white/10 hover:text-destructive transition-colors">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Limpiar filtros</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="dashboard-card border-none bg-gradient-to-b from-white/5 to-transparent">
        <CardContent className="p-0">
          <div className="rounded-xl border border-white/5 bg-black/20 overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-medium">Código</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Nombre</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Tipo</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Estado</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Personas</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Fecha Adquisición</TableHead>
                  <TableHead className="w-[120px] text-muted-foreground font-medium">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipmentData.length > 0 ? (
                  equipmentData.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="group border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <TableCell>
                        <Link href={`/equipos/${item.id}`} className="font-medium hover:text-primary transition-colors text-foreground">
                          {item.codigo}
                        </Link>
                      </TableCell>
                      <TableCell className="font-medium text-foreground/90">{item.nombre}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-foreground/80 hover:bg-white/10 transition-colors">
                          {item.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={item.estado} />
                      </TableCell>
                      <TableCell>
                        {item.persona ? (
                          <Link href={`/personas/${item.persona.id}`} className="hover:text-primary transition-colors flex flex-col group/person">
                            <span className="font-medium text-foreground/90 group-hover/person:text-primary transition-colors">{`${item.persona.nombre} ${item.persona.apellido}`}</span>
                            {item.persona.departamento && (
                              <span className="text-xs text-muted-foreground">{item.persona.departamento}</span>
                            )}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground/60 text-sm italic">No asignado</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(item.fecha_adquisicion)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <EditButton id={item.id} type="equipo" />
                          <DeleteButton
                            id={item.id}
                            type="equipo"
                            name={`${item.codigo} - ${item.nombre}`}
                            onDelete={handleDelete}
                          />
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-8 w-8 opacity-50" />
                        <p>No se encontraron equipos</p>
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

function StatusBadge({ status }: { status: string }) {
  let className = "border-transparent font-medium"

  switch (status) {
    case "Disponible":
      className += " bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20"
      break
    case "Asignado":
      className += " bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20"
      break
    case "En mantenimiento":
      className += " bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20"
      break
    case "Dado de baja":
      className += " bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"
      break
    default:
      className += " bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 border-gray-500/20"
  }

  return (
    <Badge variant="outline" className={className}>
      {status}
    </Badge>
  )
}
