import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { EquipmentForm } from "@/components/equipment/equipment-form"

export const dynamic = "force-dynamic"

export default async function EditarEquipoPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerClient()

  // Obtener detalles del equipo
  const { data: equipment } = await supabase.from("equipos").select("*").eq("id", params.id).single()

  if (!equipment) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Equipo</h1>
        <p className="text-muted-foreground">Modifica los detalles del equipo</p>
      </div>
      <EquipmentForm equipment={equipment} />
    </div>
  )
}
