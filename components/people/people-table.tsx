"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Person } from "@/lib/supabase/schema"
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react"
import { DeleteButton } from "@/components/delete-button"
import { EditButton } from "@/components/edit-button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

interface PeopleTableProps {
  people: Person[]
  pageCount: number
  currentPage: number
  departamentos: string[]
}

export function PeopleTable({ people, pageCount, currentPage, departamentos }: PeopleTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [selectedDepartamento, setSelectedDepartamento] = useState(searchParams.get("departamento") || "")

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
    router.push(`/personas?${createQueryString("search", searchTerm)}`)
  }

  const handleDepartamentoChange = (value: string) => {
    setSelectedDepartamento(value)
    router.push(`/personas?${createQueryString("departamento", value)}`)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedDepartamento("")
    router.push("/personas")
  }

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`/personas?${params.toString()}`)
  }

  const handleDelete = () => {
    router.refresh()
  }

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
                  placeholder="Buscar por nombre, apellido, email o placa de vehículo..."
                  className="pl-10 w-full bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all h-10 rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
            <div className="flex gap-3">
              <Select value={selectedDepartamento} onValueChange={handleDepartamentoChange}>
                <SelectTrigger className="w-[180px] bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 h-10 rounded-xl">
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/10 backdrop-blur-xl">
                  <SelectItem value="all">Todos los departamentos</SelectItem>
                  {departamentos.map((departamento) => (
                    <SelectItem key={departamento} value={departamento}>
                      {departamento}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(searchTerm || selectedDepartamento) && (
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
                  <TableHead className="text-muted-foreground font-medium">Nombre</TableHead>
                  <TableHead className="text-muted-foreground font-medium">ID</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Departamento</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Cargo</TableHead>
                  <TableHead className="text-muted-foreground font-medium">TA Edificio</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Email</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Teléfono</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Vehículos</TableHead>
                  <TableHead className="w-[120px] text-muted-foreground font-medium">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {people.length > 0 ? (
                  people.map((person, index) => (
                    <motion.tr
                      key={person.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="group border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <TableCell>
                        <Link href={`/personas/${person.id}`} className="font-medium hover:text-primary transition-colors text-foreground">
                          {`${person.nombre} ${person.apellido}`}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{person.id_persona || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-foreground/80 hover:bg-white/10 transition-colors">
                          {person.departamento || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground/90">{person.cargo || "N/A"}</TableCell>
                      <TableCell className="text-foreground/90">{person.ta_edificio || "N/A"}</TableCell>
                      <TableCell>
                        {person.email ? (
                          <a href={`mailto:${person.email}`} className="hover:text-primary transition-colors text-foreground/80">
                            {person.email}
                          </a>
                        ) : (
                          <span className="text-muted-foreground/60 text-sm italic">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {person.telefono ? (
                          <a href={`tel:${person.telefono}`} className="hover:text-primary transition-colors text-foreground/80">
                            {person.telefono}
                          </a>
                        ) : (
                          <span className="text-muted-foreground/60 text-sm italic">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {person.tiene_vehiculo ? (
                          <div className="flex flex-col gap-1">
                            {person.tiene_carro && (
                              <div className="flex items-center gap-1">
                                <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-500 border-blue-500/20">
                                  Carro
                                </Badge>
                                {person.placa_carro && <span className="text-xs text-muted-foreground">{person.placa_carro}</span>}
                              </div>
                            )}
                            {person.tiene_moto && (
                              <div className="flex items-center gap-1">
                                <Badge variant="secondary" className="text-xs bg-purple-500/10 text-purple-500 border-purple-500/20">
                                  Moto
                                </Badge>
                                {person.placa_moto && <span className="text-xs text-muted-foreground">{person.placa_moto}</span>}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground/60 text-sm">No</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <EditButton id={person.id} type="persona" />
                          <DeleteButton
                            id={person.id}
                            type="persona"
                            name={`${person.nombre} ${person.apellido}`}
                            onDelete={handleDelete}
                          />
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-8 w-8 opacity-50" />
                        <p>No se encontraron personas</p>
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
