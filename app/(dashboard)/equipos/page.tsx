import { createServerClient } from "@/lib/supabase/server"
import { EquipmentHeader } from "@/components/equipment/equipment-header"
import { EquipmentTable } from "@/components/equipment/equipment-table"
import type { EquipmentWithAssignment } from "@/lib/supabase/schema"

export const dynamic = "force-dynamic"

export default async function EquiposPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createServerClient()

  // Obtener parámetros de búsqueda
  const page = Number(searchParams.page) || 1
  const pageSize = 10
  const search = typeof searchParams.search === "string" ? searchParams.search : ""
  const estado = typeof searchParams.estado === "string" ? searchParams.estado : ""
  const tipo = typeof searchParams.tipo === "string" ? searchParams.tipo : ""

  // Construir consulta
  let query = supabase.from("equipment_with_assignments").select("*", { count: "exact" })

  // Aplicar filtros
  if (search) {
    query = query.or(`codigo.ilike.%${search}%,nombre.ilike.%${search}%,numero_serie.ilike.%${search}%`)
  }

  if (estado) {
    query = query.eq("estado", estado)
  }

  if (tipo) {
    query = query.eq("tipo", tipo)
  }

  // Paginación
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data: equipment, count } = await query.order("codigo").range(from, to)

  // Obtener tipos y estados para filtros
  const { data: tipos } = await supabase.from("equipos").select("tipo").order("tipo")

  const { data: estados } = await supabase.from("equipos").select("estado").order("estado")

  // Eliminar duplicados
  const tiposUnicos = Array.from(new Set(tipos?.map((item: any) => item.tipo))).filter((item: any): item is string => typeof item === "string")
  const estadosUnicos = Array.from(new Set(estados?.map((item: any) => item.estado))).filter((item: any): item is string => typeof item === "string")

  return (
    <div className="space-y-6">
      <EquipmentHeader />
      <EquipmentTable
        equipment={(equipment as EquipmentWithAssignment[]) || []}
        pageCount={Math.ceil((count || 0) / pageSize)}
        currentPage={page}
        tipos={tiposUnicos}
        estados={estadosUnicos}
      />
    </div>
  )
}
