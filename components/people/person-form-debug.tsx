"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

// Esquema de validación con manejo explícito de valores nulos
const personFormSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido: z.string().min(1, "El apellido es obligatorio"),
  departamento: z.string().optional().nullable(),
  cargo: z.string().optional().nullable(),
  email: z.string().email("Email inválido").optional().nullable(),
  telefono: z.string().optional().nullable(),
  ta_edificio: z.string().optional().nullable(),
  id_persona: z.string().optional().nullable(),
  tiene_vehiculo: z.boolean().default(false),
  tiene_carro: z.boolean().default(false),
  tiene_moto: z.boolean().default(false),
  placa_carro: z.string().optional().nullable(),
  placa_moto: z.string().optional().nullable(),
})

type PersonFormValues = z.infer<typeof personFormSchema>

// Valores por defecto explícitos para todos los campos
const defaultValues: PersonFormValues = {
  nombre: "",
  apellido: "",
  departamento: null,
  cargo: null,
  email: null,
  telefono: null,
  ta_edificio: null,
  id_persona: null,
  tiene_vehiculo: false,
  tiene_carro: false,
  tiene_moto: false,
  placa_carro: null,
  placa_moto: null,
}

export function PersonFormDebug({ person }: { person?: any }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  // Inicializar el formulario con valores por defecto o datos existentes
  const form = useForm<PersonFormValues>({
    resolver: zodResolver(personFormSchema),
    defaultValues: person
      ? {
          ...defaultValues,
          ...person,
          // Asegurar que los booleanos sean realmente booleanos
          tiene_vehiculo: Boolean(person.tiene_vehiculo),
          tiene_carro: Boolean(person.tiene_carro),
          tiene_moto: Boolean(person.tiene_moto),
        }
      : defaultValues,
  })

  const watchTieneVehiculo = form.watch("tiene_vehiculo")
  const watchTieneCarro = form.watch("tiene_carro")
  const watchTieneMoto = form.watch("tiene_moto")

  async function onSubmit(data: PersonFormValues) {
    setIsLoading(true)
    setDebugInfo({ step: "Inicio de onSubmit", data })

    try {
      // Preparar los datos para enviar a la base de datos
      const formData = {
        nombre: data.nombre,
        apellido: data.apellido,
        departamento: data.departamento || null,
        cargo: data.cargo || null,
        email: data.email || null,
        telefono: data.telefono || null,
        ta_edificio: data.ta_edificio || null,
        id_persona: data.id_persona || null,
        tiene_vehiculo: Boolean(data.tiene_vehiculo),
        tiene_carro: Boolean(data.tiene_carro),
        tiene_moto: Boolean(data.tiene_moto),
        placa_carro: data.placa_carro || null,
        placa_moto: data.placa_moto || null,
      }

      setDebugInfo((prev) => ({ ...prev, step: "Datos procesados", formData }))

      // Si no tiene vehículo, asegurarse de que los campos relacionados estén vacíos
      if (!formData.tiene_vehiculo) {
        formData.tiene_carro = false
        formData.tiene_moto = false
        formData.placa_carro = null
        formData.placa_moto = null
      } else {
        // Si no tiene carro o moto específicamente, limpiar sus campos
        if (!formData.tiene_carro) {
          formData.placa_carro = null
        }
        if (!formData.tiene_moto) {
          formData.placa_moto = null
        }
      }

      setDebugInfo((prev) => ({ ...prev, step: "Datos finales", formData }))

      if (person) {
        // Actualizar persona existente
        setDebugInfo((prev) => ({ ...prev, step: "Actualizando persona existente" }))
        const { data: updateData, error } = await supabase
          .from("personas")
          .update(formData)
          .eq("id", person.id)
          .select()

        setDebugInfo((prev) => ({ ...prev, step: "Respuesta de actualización", updateData, error }))

        if (error) throw error

        toast({
          title: "Persona actualizada",
          description: "La persona ha sido actualizada correctamente",
        })
      } else {
        // Crear nueva persona
        setDebugInfo((prev) => ({ ...prev, step: "Creando nueva persona" }))
        const { data: insertData, error } = await supabase.from("personas").insert(formData).select()

        setDebugInfo((prev) => ({ ...prev, step: "Respuesta de inserción", insertData, error }))

        if (error) throw error

        toast({
          title: "Persona creada",
          description: "La persona ha sido creada correctamente",
        })
      }

      // Verificar si la redirección está funcionando
      setDebugInfo((prev) => ({ ...prev, step: "Intentando redireccionar" }))
      router.push("/personas")
      router.refresh()
    } catch (error: any) {
      setDebugInfo((prev) => ({ ...prev, step: "Error capturado", error: error.message || "Error desconocido" }))

      toast({
        title: "Error",
        description: error.message || "Ha ocurrido un error",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apellido"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido *</FormLabel>
                  <FormControl>
                    <Input placeholder="Pérez" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="id_persona"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input placeholder="12345" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>Identificador de la persona</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ta_edificio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TA Edificio</FormLabel>
                  <FormControl>
                    <Input placeholder="Edificio A" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>Ubicación o edificio asignado</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="departamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento</FormLabel>
                  <FormControl>
                    <Input placeholder="IT" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>Departamento al que pertenece</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cargo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <FormControl>
                    <Input placeholder="Desarrollador" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="juan.perez@ejemplo.com" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="+34 123 456 789" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Sección de vehículo */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Información de Vehículo</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="tiene_vehiculo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Tiene vehículo</FormLabel>
                      <FormDescription>Marque esta casilla si la persona tiene un vehículo registrado</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {watchTieneVehiculo && (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Sección de Carro */}
                    <div className="border rounded-lg p-3">
                      <FormField
                        control={form.control}
                        name="tiene_carro"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-4">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Tiene carro</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      {watchTieneCarro && (
                        <FormField
                          control={form.control}
                          name="placa_carro"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Placa del Carro</FormLabel>
                              <FormControl>
                                <Input placeholder="ABC123" {...field} value={field.value || ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    {/* Sección de Moto */}
                    <div className="border rounded-lg p-3">
                      <FormField
                        control={form.control}
                        name="tiene_moto"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-4">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Tiene moto</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      {watchTieneMoto && (
                        <FormField
                          control={form.control}
                          name="placa_moto"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Placa de la Moto</FormLabel>
                              <FormControl>
                                <Input placeholder="XYZ789" {...field} value={field.value || ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {person ? "Actualizar Persona" : "Crear Persona"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </form>
      </Form>

      {/* Información de depuración */}
      {debugInfo && (
        <div className="mt-8 p-4 border rounded-lg bg-muted">
          <h3 className="text-lg font-medium mb-2">Información de depuración</h3>
          <pre className="text-xs overflow-auto max-h-60">{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}
    </>
  )
}
