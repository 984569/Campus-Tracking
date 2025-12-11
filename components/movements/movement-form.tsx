"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const movementFormSchema = z.object({
  equipo_id: z.string().min(1, "El equipo es obligatorio"),
  tipo_movimiento: z.string().min(1, "El tipo de movimiento es obligatorio"),
  fecha_movimiento: z.date(),
  persona_id: z.string().optional(),
  persona_origen_id: z.string().optional(),
  persona_destino_id: z.string().optional(),
  notas: z.string().optional(),
})

type MovementFormValues = z.infer<typeof movementFormSchema>

const defaultValues: Partial<MovementFormValues> = {
  fecha_movimiento: new Date(),
}

const tiposMovimiento = [
  "Entrada",
  "Salida",
  "Transferencia",
  "Mantenimiento",
  "Baja",
  "Préstamo",
  "Devolución préstamo",
  "Devolución egreso",
]

interface Equipo {
  id: string
  codigo: string
  nombre: string
  estado: string
}

interface Persona {
  id: string
  nombre: string
  apellido: string
  departamento?: string
}

interface MovementFormProps {
  equipos: Equipo[]
  personas: Persona[]
  equipoSeleccionado?: Equipo
  tipoMovimientoSeleccionado?: string
  movement?: any
}

export function MovementForm({
  equipos,
  personas,
  equipoSeleccionado,
  tipoMovimientoSeleccionado,
  movement,
}: MovementFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [tipoMovimiento, setTipoMovimiento] = useState(tipoMovimientoSeleccionado || movement?.tipo_movimiento || "")

  const form = useForm<MovementFormValues>({
    resolver: zodResolver(movementFormSchema),
    defaultValues: movement
      ? {
          ...movement,
          fecha_movimiento: movement.fecha_movimiento ? new Date(movement.fecha_movimiento) : new Date(),
        }
      : {
          ...defaultValues,
          equipo_id: equipoSeleccionado?.id || "",
          tipo_movimiento: tipoMovimientoSeleccionado || "",
        },
  })

  // Actualizar el formulario cuando cambia el equipo seleccionado
  useEffect(() => {
    if (equipoSeleccionado) {
      form.setValue("equipo_id", equipoSeleccionado.id)
    }
  }, [equipoSeleccionado, form])

  // Actualizar el formulario cuando cambia el tipo de movimiento seleccionado
  useEffect(() => {
    if (tipoMovimientoSeleccionado) {
      form.setValue("tipo_movimiento", tipoMovimientoSeleccionado)
      setTipoMovimiento(tipoMovimientoSeleccionado)
    }
  }, [tipoMovimientoSeleccionado, form])

  // Manejar cambios en el tipo de movimiento
  const handleTipoMovimientoChange = (value: string) => {
    setTipoMovimiento(value)
    form.setValue("tipo_movimiento", value)

    // Limpiar campos relacionados con personas según el tipo de movimiento
    if (value === "Entrada" || value === "Mantenimiento" || value === "Baja") {
      form.setValue("persona_id", undefined)
      form.setValue("persona_origen_id", undefined)
      form.setValue("persona_destino_id", undefined)
    } else if (value === "Salida" || value === "Préstamo") {
      form.setValue("persona_origen_id", undefined)
      form.setValue("persona_destino_id", undefined)
    } else if (value === "Transferencia") {
      form.setValue("persona_id", undefined)
    } else if (value === "Devolución préstamo" || value === "Devolución egreso") {
      form.setValue("persona_destino_id", undefined)
    }
  }

  async function onSubmit(data: MovementFormValues) {
    setIsLoading(true)
    try {
      if (movement) {
        // Actualizar movimiento existente
        const { error } = await supabase.from("movimientos").update(data).eq("id", movement.id)

        if (error) throw error

        toast({
          title: "Movimiento actualizado",
          description: "El movimiento ha sido actualizado correctamente",
        })
      } else {
        // Crear nuevo movimiento
        const { error } = await supabase.from("movimientos").insert(data)

        if (error) throw error

        // Actualizar estado del equipo según el tipo de movimiento
        let nuevoEstado = ""
        switch (data.tipo_movimiento) {
          case "Entrada":
            nuevoEstado = "Disponible"
            break
          case "Salida":
            nuevoEstado = "Asignado"
            break
          case "Mantenimiento":
            nuevoEstado = "En mantenimiento"
            break
          case "Baja":
            nuevoEstado = "Dado de baja"
            break
          case "Transferencia":
            nuevoEstado = "Asignado"
            break
          case "Préstamo":
            nuevoEstado = "Asignado"
            break
          case "Devolución préstamo":
            nuevoEstado = "Disponible"
            break
          case "Devolución egreso":
            nuevoEstado = "Disponible"
            break
        }

        if (nuevoEstado) {
          await supabase.from("equipos").update({ estado: nuevoEstado }).eq("id", data.equipo_id)
        }

        toast({
          title: "Movimiento registrado",
          description: "El movimiento ha sido registrado correctamente",
        })
      }

      router.push("/movimientos")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ha ocurrido un error",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Determinar si se necesita persona origen o destino según el tipo de movimiento
  const requierePersonaOrigen =
    tipoMovimiento === "Transferencia" ||
    tipoMovimiento === "Devolución préstamo" ||
    tipoMovimiento === "Devolución egreso"

  const requierePersonaDestino = tipoMovimiento === "Transferencia"

  const requierePersona = tipoMovimiento === "Salida" || tipoMovimiento === "Préstamo"

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="equipo_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipo *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!!equipoSeleccionado || !!movement}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un equipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {equipos.map((equipo) => (
                      <SelectItem key={equipo.id} value={equipo.id}>
                        {equipo.codigo} - {equipo.nombre} ({equipo.estado})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Equipo involucrado en el movimiento</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tipo_movimiento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Movimiento *</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    handleTipoMovimientoChange(value)
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tiposMovimiento.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Tipo de movimiento a registrar</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fecha_movimiento"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha del Movimiento *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>Fecha en que ocurrió el movimiento</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campos condicionales según el tipo de movimiento */}
          {requierePersona && (
            <FormField
              control={form.control}
              name="persona_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Persona Asignada *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una persona" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {personas.map((persona) => (
                        <SelectItem key={persona.id} value={persona.id}>
                          {persona.nombre} {persona.apellido}
                          {persona.departamento && ` (${persona.departamento})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Persona a la que se asigna el equipo</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {requierePersonaOrigen && (
            <FormField
              control={form.control}
              name="persona_origen_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Persona Origen *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona persona origen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {personas.map((persona) => (
                        <SelectItem key={persona.id} value={persona.id}>
                          {persona.nombre} {persona.apellido}
                          {persona.departamento && ` (${persona.departamento})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Persona que entrega el equipo</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {requierePersonaDestino && (
            <FormField
              control={form.control}
              name="persona_destino_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Persona Destino *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona persona destino" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {personas.map((persona) => (
                        <SelectItem key={persona.id} value={persona.id}>
                          {persona.nombre} {persona.apellido}
                          {persona.departamento && ` (${persona.departamento})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Persona que recibe el equipo</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <FormField
          control={form.control}
          name="notas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea placeholder="Información adicional sobre el movimiento" className="min-h-32" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {movement ? "Actualizar Movimiento" : "Registrar Movimiento"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  )
}
