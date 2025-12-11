"use client"

import { useRouter } from "next/navigation"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EditButtonProps {
  id: string
  type: "equipo" | "persona" | "movimiento"
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function EditButton({ id, type, className, variant = "outline", size = "icon" }: EditButtonProps) {
  const router = useRouter()

  const getEditPath = () => {
    switch (type) {
      case "equipo":
        return `/equipos/${id}/editar`
      case "persona":
        return `/personas/${id}/editar`
      case "movimiento":
        return `/movimientos/${id}/editar`
      default:
        return "/"
    }
  }

  const handleEdit = () => {
    router.push(getEditPath())
  }

  return (
    <Button variant={variant} size={size} onClick={handleEdit} className={className}>
      <Pencil className="h-4 w-4" />
      <span className="sr-only">Editar {type}</span>
    </Button>
  )
}
