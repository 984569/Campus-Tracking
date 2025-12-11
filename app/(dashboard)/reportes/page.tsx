import { createServerClient } from "@/lib/supabase/server"
import { ReportsHeader } from "@/components/reports/reports-header"
import { ReportsCharts } from "@/components/reports/reports-charts"
import { ReportsTable } from "@/components/reports/reports-table"
import { ReportsEquipmentByType } from "@/components/reports/reports-equipment-by-type"
import { ReportsMovementsByType } from "@/components/reports/reports-movements-by-type"
import type { EquipmentCountByStatus, EquipmentCountByType } from "@/lib/supabase/schema"

export const dynamic = "force-dynamic"

export default async function ReportesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createServerClient()

  // Obtener parámetros de búsqueda
  const tipoEquipo = typeof searchParams.tipoEquipo === "string" ? searchParams.tipoEquipo : ""
  const tipoMovimiento = typeof searchParams.tipoMovimiento === "string" ? searchParams.tipoMovimiento : ""

  // Obtener conteo de equipos por estado
  const { data: equipmentByStatus } = await supabase.from("equipment_counts_by_status").select("*")

  // Obtener conteo de equipos por tipo
  const { data: equipmentByType } = await supabase.from("equipment_counts_by_type").select("*")

  // Obtener movimientos recientes
  const { data: recentMovements } = await supabase
    .from("equipment_movement_history")
    .select("*")
    .order("fecha_movimiento", { ascending: false })
    .limit(10)

  // Obtener equipos filtrados por tipo
  let equipmentQuery = supabase.from("equipment_with_assignments").select("*")
  if (tipoEquipo) {
    equipmentQuery = equipmentQuery.eq("tipo", tipoEquipo)
  }
  const { data: filteredEquipment } = await equipmentQuery.order("codigo")

  // Obtener movimientos filtrados por tipo
  let movementsQuery = supabase.from("equipment_movement_history").select("*")
  if (tipoMovimiento) {
    movementsQuery = movementsQuery.eq("tipo_movimiento", tipoMovimiento)
  }
  const { data: filteredMovements } = await movementsQuery.order("fecha_movimiento", { ascending: false }).limit(20)

  // Obtener todos los equipos para exportación
  const { data: allEquipment } = await supabase.from("equipment_with_assignments").select("*").order("codigo")

  // Obtener todos los movimientos para exportación
  const { data: allMovements } = await supabase
    .from("equipment_movement_history")
    .select("*")
    .order("fecha_movimiento", { ascending: false })

  // Obtener tipos de equipos para filtros
  const { data: tiposEquipo } = await supabase.from("equipos").select("tipo").order("tipo")
  const tiposEquipoUnicos = [...new Set((tiposEquipo || []).map((item: { tipo: string }) => item.tipo))] as string[]

  return (
    <div className="space-y-6">
      <ReportsHeader equipmentData={allEquipment || []} movementsData={allMovements || []} />
      <ReportsCharts
        equipmentByStatus={(equipmentByStatus as EquipmentCountByStatus[]) || []}
        equipmentByType={(equipmentByType as EquipmentCountByType[]) || []}
      />
      <ReportsEquipmentByType equipment={filteredEquipment || []} tipos={tiposEquipoUnicos} selectedTipo={tipoEquipo} />
      <ReportsMovementsByType movements={filteredMovements || []} selectedTipo={tipoMovimiento} />
      <ReportsTable movements={recentMovements || []} />
    </div>
  )
}
