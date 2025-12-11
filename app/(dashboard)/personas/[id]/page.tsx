import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { PersonDetail } from "@/components/people/person-detail"
import { PersonEquipment } from "@/components/people/person-equipment"

export const dynamic = "force-dynamic"

export default async function PersonaDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerClient()

  // Obtener detalles de la persona
  const { data: person } = await supabase.from("personas").select("*").eq("id", params.id).single()

  if (!person) {
    notFound()
  }

  // Obtener equipos asignados a la persona
  const { data: assignedEquipment } = await supabase
    .from("equipment_with_assignments")
    .select("*")
    .or(`persona_id.eq.${params.id},persona_id.eq.${params.id}`)

  return (
    <div className="space-y-6">
      <PersonDetail person={person} />
      <PersonEquipment equipment={assignedEquipment || []} />
    </div>
  )
}
