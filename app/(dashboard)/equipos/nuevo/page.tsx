import { EquipmentForm } from "@/components/equipment/equipment-form"

export default function NuevoEquipoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Equipo</h1>
        <p className="text-muted-foreground">Añade un nuevo equipo al inventario</p>
      </div>
      <EquipmentForm />
    </div>
  )
}
