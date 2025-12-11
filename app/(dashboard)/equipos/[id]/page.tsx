import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { EquipmentDetail } from "@/components/equipment/equipment-detail"
import { EquipmentMovements } from "@/components/equipment/equipment-movements"

export const dynamic = "force-dynamic"

export default async function EquipoDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerClient()

  // Obtener detalles del equipo
  const { data: equipment } = await supabase.from("equipment_with_assignments").select("*").eq("id", params.id).single()

  if (!equipment) {
    notFound()
  }

  // Obtener historial de movimientos
  const { data: movements } = await supabase
    .from("equipment_movement_history")
    .select("*")
    .eq("equipo_id", params.id)
    .order("fecha_movimiento", { ascending: false })

  return (
    <div className="space-y-6">
      <EquipmentDetail equipment={equipment} />
      <EquipmentMovements movements={movements || []} />
    </div>
  )
}
