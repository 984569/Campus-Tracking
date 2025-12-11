"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { supabase } from "@/lib/supabase/client"

interface DeleteButtonProps {
  id: string
  type: "equipo" | "persona" | "movimiento"
  name: string
  onDelete?: () => void
  equipoId?: string // Añadido para movimientos
}

export function DeleteButton({ id, type, name, onDelete, equipoId }: DeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const getTableName = () => {
    switch (type) {
      case "equipo":
        return "equipos"
      case "persona":
        return "personas"
      case "movimiento":
        return "movimientos"
      default:
        return ""
    }
  }

  const getRedirectPath = () => {
    switch (type) {
      case "equipo":
        return "/equipos"
      case "persona":
        return "/personas"
      case "movimiento":
        return "/movimientos"
      default:
        return "/"
    }
  }

  const getConfirmationMessage = () => {
    switch (type) {
      case "equipo":
        return `¿Estás seguro de que deseas eliminar el equipo "${name}"? Esta acción no se puede deshacer.`
      case "persona":
        return `¿Estás seguro de que deseas eliminar a "${name}"? Esta acción no se puede deshacer.`
      case "movimiento":
        return `¿Estás seguro de que deseas eliminar este movimiento? Esta acción no se puede deshacer y actualizará el estado del equipo según su historial de movimientos.`
      default:
        return "¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer."
    }
  }

  // Función para actualizar el estado del equipo basado en su historial de movimientos
  const updateEquipmentState = async (equipoId: string) => {
    try {
      // Obtener el movimiento más reciente para este equipo (excluyendo el que estamos eliminando)
      const { data: latestMovement } = await supabase
        .from("movimientos")
        .select("*")
        .eq("equipo_id", equipoId)
        .neq("id", id) // Excluir el movimiento que estamos eliminando
        .order("fecha_movimiento", { ascending: false })
        .limit(1)
        .single()

      let nuevoEstado = "Disponible" // Estado por defecto si no hay movimientos anteriores

      if (latestMovement) {
        // Determinar el estado basado en el tipo del último movimiento
        switch (latestMovement.tipo_movimiento) {
          case "Entrada":
            nuevoEstado = "Disponible"
            break
          case "Salida":
            nuevoEstado = "Asignado"
            break
          case "Transferencia":
            nuevoEstado = "Asignado"
            break
          case "Mantenimiento":
            nuevoEstado = "En mantenimiento"
            break
          case "Baja":
            nuevoEstado = "Dado de baja"
            break
        }
      }

      // Actualizar el estado del equipo
      const { error } = await supabase.from("equipos").update({ estado: nuevoEstado }).eq("id", equipoId)

      if (error) throw error

      console.log(`Estado del equipo actualizado a: ${nuevoEstado}`)
    } catch (error) {
      console.error("Error al actualizar el estado del equipo:", error)
      throw error
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const tableName = getTableName()

      // Si estamos eliminando un movimiento, primero obtenemos información sobre el equipo
      if (type === "movimiento") {
        // Si no se proporcionó equipoId, necesitamos obtenerlo del movimiento
        let targetEquipoId = equipoId

        if (!targetEquipoId) {
          const { data: movement } = await supabase.from("movimientos").select("equipo_id").eq("id", id).single()

          if (movement) {
            targetEquipoId = movement.equipo_id
          }
        }

        // Eliminar el movimiento
        const { error } = await supabase.from(tableName).delete().eq("id", id)
        if (error) throw error

        // Actualizar el estado del equipo basado en su historial de movimientos
        if (targetEquipoId) {
          await updateEquipmentState(targetEquipoId)
        }
      } else {
        // Para otros tipos, simplemente eliminar el registro
        const { error } = await supabase.from(tableName).delete().eq("id", id)
        if (error) throw error
      }

      toast({
        title: "Eliminado correctamente",
        description: `El ${type} ha sido eliminado correctamente.`,
      })

      if (onDelete) {
        onDelete()
      } else {
        router.push(getRedirectPath())
        router.refresh()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `No se pudo eliminar el ${type}.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Eliminar {type}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>{getConfirmationMessage()}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
