import { createServerClient } from "@/lib/supabase/server"
import { MovementForm } from "@/components/movements/movement-form"

export const dynamic = "force-dynamic"

export default async function NuevoMovimientoPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createServerClient()

  // Obtener equipos para el selector
  const { data: equipos } = await supabase.from("equipos").select("id, codigo, nombre, estado").order("codigo")

  // Obtener personas para el selector
  const { data: personas } = await supabase
    .from("personas")
    .select("id, nombre, apellido, departamento")
    .order("apellido")

  // Obtener equipo preseleccionado si viene en la URL
  const equipoId = typeof searchParams.equipo === "string" ? searchParams.equipo : undefined
  const tipoMovimiento = typeof searchParams.tipo === "string" ? searchParams.tipo : undefined

  let equipoSeleccionado = undefined

  if (equipoId) {
    const { data } = await supabase.from("equipos").select("*").eq("id", equipoId).single()

    equipoSeleccionado = data
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Movimiento</h1>
        <p className="text-muted-foreground">Registra un nuevo movimiento de equipo</p>
      </div>
      <MovementForm
        equipos={equipos || []}
        personas={personas || []}
        equipoSeleccionado={equipoSeleccionado}
        tipoMovimientoSeleccionado={tipoMovimiento}
      />
    </div>
  )
}
