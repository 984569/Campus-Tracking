"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code } from "lucide-react"

interface DebugFormProps {
  data: any
}

export function DebugForm({ data }: DebugFormProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="mt-4">
      <Button variant="outline" size="sm" onClick={() => setIsVisible(!isVisible)} className="flex items-center gap-2">
        <Code className="h-4 w-4" />
        {isVisible ? "Ocultar datos" : "Depurar formulario"}
      </Button>

      {isVisible && (
        <Card className="mt-2">
          <CardHeader className="py-2">
            <CardTitle className="text-sm">Datos del formulario</CardTitle>
            <CardDescription>Información para depuración</CardDescription>
          </CardHeader>
          <CardContent className="py-2">
            <pre className="text-xs overflow-auto max-h-60 p-2 bg-muted rounded-md">
              {JSON.stringify(data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
