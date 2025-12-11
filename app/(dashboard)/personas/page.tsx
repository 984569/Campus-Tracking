import { createServerClient } from "@/lib/supabase/server"
import { PeopleHeader } from "@/components/people/people-header"
import { PeopleTable } from "@/components/people/people-table"
import type { Person } from "@/lib/supabase/schema"

export const dynamic = "force-dynamic"

export default async function PersonasPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createServerClient()

  // Obtener parámetros de búsqueda
  const page = Number(searchParams.page) || 1
  const pageSize = 10
  const search = typeof searchParams.search === "string" ? searchParams.search : ""
  const departamento = typeof searchParams.departamento === "string" ? searchParams.departamento : ""

  // Construir consulta
  let query = supabase.from("personas").select("*", { count: "exact" })

  // Aplicar filtros
  if (search) {
    query = query.or(
      `nombre.ilike.%${search}%,apellido.ilike.%${search}%,email.ilike.%${search}%,placa_carro.ilike.%${search}%,placa_moto.ilike.%${search}%`,
    )
  }

  if (departamento) {
    query = query.eq("departamento", departamento)
  }

  // Paginación
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data: people, count } = await query.order("apellido").range(from, to)

  // Obtener departamentos para filtros
  const { data: departamentos } = await supabase.from("personas").select("departamento").order("departamento")

  // Eliminar duplicados
  const departamentosUnicos: string[] = [
    ...new Set(
      ((departamentos as any[]) || [])
        .map((item: any) => item.departamento)
        .filter((d: any): d is string => typeof d === "string" && d.length > 0),
    ),
  ]

  return (
    <div className="space-y-6">
      <PeopleHeader />
      <PeopleTable
        people={(people as Person[]) || []}
        pageCount={Math.ceil((count || 0) / pageSize)}
        currentPage={page}
        departamentos={departamentosUnicos}
      />
    </div>
  )
}
