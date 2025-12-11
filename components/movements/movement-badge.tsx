import { Badge } from "@/components/ui/badge"

interface MovementBadgeProps {
  type: string
}

export function MovementBadge({ type }: MovementBadgeProps) {
  let variant: "default" | "secondary" | "destructive" | "outline" | null | undefined = "default"

  switch (type) {
    case "Entrada":
      variant = "default"
      break
    case "Salida":
      variant = "secondary"
      break
    case "Transferencia":
      variant = "outline"
      break
    case "Mantenimiento":
      variant = "secondary"
      break
    case "Baja":
      variant = "destructive"
      break
    case "Préstamo":
      variant = "outline"
      break
    case "Devolución préstamo":
      variant = "default"
      break
    case "Devolución egreso":
      variant = "default"
      break
  }

  return <Badge variant={variant}>{type}</Badge>
}
