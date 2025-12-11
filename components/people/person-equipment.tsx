import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

interface Equipment {
  id: string
  codigo: string
  nombre: string
  tipo: string
  estado: string
  fecha_adquisicion?: string
}

interface PersonEquipmentProps {
  equipment: Equipment[]
}

export function PersonEquipment({ equipment }: PersonEquipmentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipos Asignados</CardTitle>
        <CardDescription>Equipos actualmente asignados a esta persona</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
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
                  <TableCell>{item.fecha_adquisicion ? formatDate(item.fecha_adquisicion) : "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No hay equipos asignados a esta persona
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
