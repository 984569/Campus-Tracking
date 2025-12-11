import { createServerClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardCards } from "@/components/dashboard/dashboard-cards"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { DashboardRecentMovements } from "@/components/dashboard/dashboard-recent-movements"
import type { EquipmentCountByStatus, EquipmentCountByType } from "@/lib/supabase/schema"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const supabase = createServerClient()

  // Obtener conteo de equipos por estado
  const { data: equipmentByStatus } = await supabase.from("equipment_counts_by_status").select("*")

  // Obtener conteo de equipos por tipo
  const { data: equipmentByType } = await supabase.from("equipment_counts_by_type").select("*")

  // Obtener movimientos recientes
  const { data: recentMovements } = await supabase
    .from("equipment_movement_history")
    .select("*")
    .order("fecha_movimiento", { ascending: false })
    .limit(5)

  // Obtener total de equipos
  const { count: totalEquipment } = await supabase.from("equipos").select("*", { count: "exact", head: true })

  // Obtener total de personas
  const { count: totalPeople } = await supabase.from("personas").select("*", { count: "exact", head: true })

  // Obtener equipos asignados
  const { count: assignedEquipment } = await supabase
    .from("equipos")
    .select("*", { count: "exact", head: true })
    .eq("estado", "Asignado")

  return (
    <div className="space-y-6">
      <DashboardHeader />
      <DashboardCards
        totalEquipment={totalEquipment || 0}
        totalPeople={totalPeople || 0}
        assignedEquipment={assignedEquipment || 0}
      />
      <div className="grid gap-6 md:grid-cols-2">
        <DashboardCharts
          equipmentByStatus={(equipmentByStatus as EquipmentCountByStatus[]) || []}
          equipmentByType={(equipmentByType as EquipmentCountByType[]) || []}
        />
      </div>
      <DashboardRecentMovements movements={recentMovements || []} />
    </div>
  )
}
