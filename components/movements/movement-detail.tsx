import Link from "next/link"
import { formatDateTime } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Pencil } from "lucide-react"
import { DeleteButton } from "@/components/delete-button"
import { EditButton } from "@/components/edit-button"
import { MovementBadge } from "./movement-badge"

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

interface MovementDetailProps {
  movement: Movement
}

export function MovementDetail({ movement }: MovementDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Detalle de Movimiento</h1>
            <MovementBadge type={movement.tipo_movimiento} />
          </div>
          <p className="text-muted-foreground">{formatDateTime(movement.fecha_movimiento)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/movimientos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>
          <EditButton id={movement.id} type="movimiento" variant="outline" size="default">
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </EditButton>
          <DeleteButton
            id={movement.id}
            type="movimiento"
            name={`Movimiento de ${movement.equipo_codigo}`}
            equipoId={movement.equipo_id}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información del Equipo</CardTitle>
            <CardDescription>Detalles del equipo involucrado</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Equipo</dt>
                <dd className="text-lg font-medium">
                  <Link href={`/equipos/${movement.equipo_id}`} className="hover:underline">
                    {movement.equipo_codigo} - {movement.equipo_nombre}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Tipo de Movimiento</dt>
                <dd className="text-sm">
                  <MovementBadge type={movement.tipo_movimiento} />
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Fecha y Hora</dt>
                <dd className="text-sm">{formatDateTime(movement.fecha_movimiento)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Asignación</CardTitle>
            <CardDescription>Información sobre las personas involucradas</CardDescription>
          </CardHeader>
          <CardContent>
            {movement.tipo_movimiento === "Entrada" ||
            movement.tipo_movimiento === "Mantenimiento" ||
            movement.tipo_movimiento === "Baja" ? (
              <p className="text-muted-foreground">No hay personas involucradas en este tipo de movimiento.</p>
            ) : movement.tipo_movimiento === "Salida" || movement.tipo_movimiento === "Préstamo" ? (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Asignado a</dt>
                <dd className="text-lg font-medium">
                  {movement.persona_id ? (
                    <Link href={`/personas/${movement.persona_id}`} className="hover:underline">
                      {`${movement.persona_nombre} ${movement.persona_apellido}`}
                    </Link>
                  ) : (
                    "N/A"
                  )}
                </dd>
              </div>
            ) : movement.tipo_movimiento === "Transferencia" ? (
              <div className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Origen</dt>
                  <dd className="text-sm">
                    {movement.persona_origen_id ? (
                      <Link href={`/personas/${movement.persona_origen_id}`} className="hover:underline">
                        {`${movement.persona_origen_nombre} ${movement.persona_origen_apellido}`}
                      </Link>
                    ) : (
                      "N/A"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Destino</dt>
                  <dd className="text-sm">
                    {movement.persona_destino_id ? (
                      <Link href={`/personas/${movement.persona_destino_id}`} className="hover:underline">
                        {`${movement.persona_destino_nombre} ${movement.persona_destino_apellido}`}
                      </Link>
                    ) : (
                      "N/A"
                    )}
                  </dd>
                </div>
              </div>
            ) : movement.tipo_movimiento === "Devolución préstamo" ||
              movement.tipo_movimiento === "Devolución egreso" ? (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Devuelto por</dt>
                <dd className="text-lg font-medium">
                  {movement.persona_origen_id ? (
                    <Link href={`/personas/${movement.persona_origen_id}`} className="hover:underline">
                      {`${movement.persona_origen_nombre} ${movement.persona_origen_apellido}`}
                    </Link>
                  ) : (
                    "N/A"
                  )}
                </dd>
              </div>
            ) : (
              <p className="text-muted-foreground">No hay personas involucradas en este tipo de movimiento.</p>
            )}
            {movement.notas && (
              <div className="mt-4">
                <dt className="text-sm font-medium text-muted-foreground">Notas</dt>
                <dd className="mt-1 text-sm whitespace-pre-line">{movement.notas}</dd>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
