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
}

export function DeleteButton({ id, type, name, onDelete }: DeleteButtonProps) {
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
        return `¿Estás seguro de que deseas eliminar este movimiento? Esta acción no se puede deshacer.`
      default:
        return "¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer."
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const tableName = getTableName()
      const { error } = await supabase.from(tableName).delete().eq("id", id)

      if (error) throw error

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
