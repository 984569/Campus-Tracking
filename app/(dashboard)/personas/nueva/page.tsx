import { PersonForm } from "@/components/people/person-form"

export default function NuevaPersonaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nueva Persona</h1>
        <p className="text-muted-foreground">Añade una nueva persona al sistema</p>
      </div>
      <PersonForm />
    </div>
  )
}
