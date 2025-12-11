import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { PersonForm } from "@/components/people/person-form"

export const dynamic = "force-dynamic"

export default async function EditarPersonaPage({
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Persona</h1>
        <p className="text-muted-foreground">Modifica los detalles de la persona</p>
      </div>
      <PersonForm person={person} />
    </div>
  )
}
