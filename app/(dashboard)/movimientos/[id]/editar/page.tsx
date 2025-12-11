import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { MovementForm } from "@/components/movements/movement-form"

export const dynamic = "force-dynamic"

export default async function EditarMovimientoPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerClient()

  // Obtener detalles del movimiento
  const { data: movement } = await supabase.from("movimientos").select("*").eq("id", params.id).single()

  if (!movement) {
    notFound()
  }

  // Obtener equipos para el selector
  const { data: equipos } = await supabase.from("equipos").select("id, codigo, nombre, estado").order("codigo")

  // Obtener personas para el selector
  const { data: personas } = await supabase
    .from("personas")
    .select("id, nombre, apellido, departamento")
    .order("apellido")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Movimiento</h1>
        <p className="text-muted-foreground">Modifica los detalles del movimiento</p>
      </div>
      <MovementForm equipos={equipos || []} personas={personas || []} movement={movement} />
    </div>
  )
}
