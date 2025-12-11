import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, ArrowLeftRight } from "lucide-react"
import { DeleteButton } from "@/components/delete-button"
import { EditButton } from "@/components/edit-button"
import type { EquipmentWithAssignment } from "@/lib/supabase/schema"

interface EquipmentDetailProps {
  equipment: EquipmentWithAssignment
}

export function EquipmentDetail({ equipment }: EquipmentDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{equipment.codigo}</h1>
            <StatusBadge status={equipment.estado} />
          </div>
          <p className="text-muted-foreground">{equipment.nombre}</p>
        </div>
        <div className="flex items-center gap-2">
          <EditButton id={equipment.id} type="equipo" variant="outline" size="default">
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </EditButton>
          <Button asChild>
            <Link href={`/movimientos/nuevo?equipo=${equipment.id}`}>
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Registrar Movimiento
            </Link>
          </Button>
          <DeleteButton id={equipment.id} type="equipo" name={`${equipment.codigo} - ${equipment.nombre}`} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Detalles del Equipo</CardTitle>
            <CardDescription>Información detallada sobre el equipo</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Tipo</dt>
                <dd className="text-sm">{equipment.tipo}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Estado</dt>
                <dd className="text-sm">{equipment.estado}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Marca</dt>
                <dd className="text-sm">{equipment.marca || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Modelo</dt>
                <dd className="text-sm">{equipment.modelo || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Número de Serie</dt>
                <dd className="text-sm">{equipment.numero_serie || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Fecha de Adquisición</dt>
                <dd className="text-sm">
                  {equipment.fecha_adquisicion ? formatDate(equipment.fecha_adquisicion) : "N/A"}
                </dd>
              </div>
            </dl>
            {equipment.notas && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-muted-foreground">Notas</h4>
                <p className="mt-1 text-sm whitespace-pre-line">{equipment.notas}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asignación Actual</CardTitle>
            <CardDescription>Información sobre la asignación actual del equipo</CardDescription>
          </CardHeader>
          <CardContent>
            {equipment.persona ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Asignado a</h4>
                  <p className="text-lg font-medium">
                    <Link href={`/personas/${equipment.persona.id}`} className="hover:underline">
                      {`${equipment.persona.nombre} ${equipment.persona.apellido}`}
                    </Link>
                  </p>
                </div>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Departamento</dt>
                    <dd className="text-sm">{equipment.persona.departamento || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Cargo</dt>
                    <dd className="text-sm">{equipment.persona.cargo || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                    <dd className="text-sm">{equipment.persona.email || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Teléfono</dt>
                    <dd className="text-sm">{equipment.persona.telefono || "N/A"}</dd>
                  </div>
                </dl>
                {equipment.ultimo_movimiento && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Fecha de Asignación</dt>
                    <dd className="text-sm">{formatDate(equipment.ultimo_movimiento.fecha_movimiento)}</dd>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <p className="text-muted-foreground">Este equipo no está asignado actualmente</p>
                <Button asChild variant="outline" className="mt-4">
                  <Link href={`/movimientos/nuevo?equipo=${equipment.id}&tipo=Salida`}>Asignar Equipo</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
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
