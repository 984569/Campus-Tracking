"use client"

import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from "recharts"
import { useState } from "react"

interface Equipment {
  id: string
  codigo: string
  nombre: string
  tipo: string
  estado: string
  fecha_adquisicion?: string
  persona_nombre?: string
  persona_apellido?: string
}

interface ReportsEquipmentByTypeProps {
  equipment: Equipment[]
  tipos: string[]
  selectedTipo: string
}

// Paleta de colores profesional
const COLORS = ["#8E44AD", "#E74C3C", "#3498DB", "#27AE60", "#F39C12", "#7F8C8D", "#9B59B6", "#16A085"]

// Componente para renderizar el sector activo en el gráfico de pastel
const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? "start" : "end"

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-sm font-medium">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="text-xs">
        {`${value} equipos`}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="text-xs">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  )
}

export function ReportsEquipmentByType({ equipment, tipos, selectedTipo }: ReportsEquipmentByTypeProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeIndex, setActiveIndex] = useState(0)

  // Preparar datos para el gráfico
  const equipmentByType = tipos
    .map((tipo) => {
      const count = equipment.filter((item) => item.tipo === tipo).length
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
    router.push(`/reportes?${createQueryString("tipoEquipo", value)}`)
  }

  const clearFilter = () => {
    router.push(`/reportes?${createQueryString("tipoEquipo", "")}`)
  }

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl">Equipos por Tipo</CardTitle>
          <CardDescription>
            {selectedTipo
              ? `Mostrando equipos de tipo: ${selectedTipo}`
              : "Selecciona un tipo para filtrar los equipos"}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedTipo} onValueChange={handleTipoChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              {tipos.map((tipo) => (
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
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={equipmentByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  onMouseEnter={onPieEnter}
                  paddingAngle={4}
                >
                  {equipmentByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} equipos`, ""]}
                  contentStyle={{ borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ paddingTop: "20px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Asignado a</TableHead>
              <TableHead>Fecha Adquisición</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipment.length > 0 ? (
              equipment.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Link href={`/equipos/${item.id}`} className="font-medium hover:underline">
                      {item.codigo}
                    </Link>
                  </TableCell>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell>{item.tipo}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.estado} />
                  </TableCell>
                  <TableCell>
                    {item.persona_nombre ? (
                      <span>{`${item.persona_nombre} ${item.persona_apellido}`}</span>
                    ) : (
                      <span className="text-muted-foreground">No asignado</span>
                    )}
                  </TableCell>
                  <TableCell>{item.fecha_adquisicion ? formatDate(item.fecha_adquisicion) : "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  {selectedTipo ? "No hay equipos de este tipo" : "Selecciona un tipo para ver los equipos"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  let variant: "default" | "secondary" | "destructive" | "outline" | null | undefined = "default"

  switch (status) {
    case "Disponible":
      variant = "default"
      break
    case "Asignado":
      variant = "secondary"
      break
    case "En mantenimiento":
      variant = "outline"
      break
    case "Dado de baja":
      variant = "destructive"
      break
  }

  return <Badge variant={variant}>{status}</Badge>
}
