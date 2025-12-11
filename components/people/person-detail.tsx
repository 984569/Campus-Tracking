import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil } from "lucide-react"
import { DeleteButton } from "@/components/delete-button"
import { EditButton } from "@/components/edit-button"
import { Badge } from "@/components/ui/badge"

interface Person {
  id: string
  nombre: string
  apellido: string
  departamento?: string
  cargo?: string
  email?: string
  telefono?: string
  ta_edificio?: string
  id_persona?: string
  tiene_vehiculo?: boolean
  tiene_carro?: boolean
  tiene_moto?: boolean
  placa_carro?: string
  placa_moto?: string
}

interface PersonDetailProps {
  person: Person
}

export function PersonDetail({ person }: PersonDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{`${person.nombre} ${person.apellido}`}</h1>
          <p className="text-muted-foreground">
            {person.departamento || "Sin departamento asignado"}
            {person.id_persona && ` • ID: ${person.id_persona}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <EditButton id={person.id} type="persona" variant="outline" size="default">
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </EditButton>
          <DeleteButton id={person.id} type="persona" name={`${person.nombre} ${person.apellido}`} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Persona</CardTitle>
            <CardDescription>Información detallada sobre la persona</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Nombre Completo</dt>
                <dd className="text-sm">{`${person.nombre} ${person.apellido}`}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">ID</dt>
                <dd className="text-sm">{person.id_persona || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Departamento</dt>
                <dd className="text-sm">{person.departamento || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">TA Edificio</dt>
                <dd className="text-sm">{person.ta_edificio || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Cargo</dt>
                <dd className="text-sm">{person.cargo || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd className="text-sm">
                  {person.email ? (
                    <a href={`mailto:${person.email}`} className="hover:underline">
                      {person.email}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Teléfono</dt>
                <dd className="text-sm">
                  {person.telefono ? (
                    <a href={`tel:${person.telefono}`} className="hover:underline">
                      {person.telefono}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información de Vehículos</CardTitle>
            <CardDescription>Detalles de los vehículos registrados</CardDescription>
          </CardHeader>
          <CardContent>
            {person.tiene_vehiculo ? (
              <div className="space-y-4">
                {person.tiene_carro && (
                  <div className="border rounded-md p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Carro</Badge>
                      {person.placa_carro && <span className="text-sm font-medium">Placa: {person.placa_carro}</span>}
                    </div>
                  </div>
                )}

                {person.tiene_moto && (
                  <div className="border rounded-md p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Moto</Badge>
                      {person.placa_moto && <span className="text-sm font-medium">Placa: {person.placa_moto}</span>}
                    </div>
                  </div>
                )}

                {!person.tiene_carro && !person.tiene_moto && (
                  <p className="text-muted-foreground">No se ha especificado el tipo de vehículo</p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Esta persona no tiene vehículos registrados</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
