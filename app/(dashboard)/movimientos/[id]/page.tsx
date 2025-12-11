import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { MovementDetail } from "@/components/movements/movement-detail"

export const dynamic = "force-dynamic"

export default async function MovimientoDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerClient()

  // Obtener detalles del movimiento
  const { data: movement } = await supabase.from("equipment_movement_history").select("*").eq("id", params.id).single()

  if (!movement) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <MovementDetail movement={movement} />
    </div>
  )
}
