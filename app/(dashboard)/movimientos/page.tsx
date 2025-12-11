import { createServerClient } from "@/lib/supabase/server"
import { MovementsHeader } from "@/components/movements/movements-header"
import { MovementsTable } from "@/components/movements/movements-table"

export const dynamic = "force-dynamic"

export default async function MovimientosPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createServerClient()

  // Obtener parámetros de búsqueda
  const page = Number(searchParams.page) || 1
  const pageSize = 10
  const tipo = typeof searchParams.tipo === "string" ? searchParams.tipo : ""

  // Construir consulta
  let query = supabase.from("equipment_movement_history").select("*", { count: "exact" })

  // Aplicar filtros
  if (tipo) {
    query = query.eq("tipo_movimiento", tipo)
  }

  // Paginación
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data: movements, count } = await query.order("fecha_movimiento", { ascending: false }).range(from, to)

  return (
    <div className="space-y-6">
      <MovementsHeader />
      <MovementsTable movements={movements || []} pageCount={Math.ceil((count || 0) / pageSize)} currentPage={page} />
    </div>
  )
}
