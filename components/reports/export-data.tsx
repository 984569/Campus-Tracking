"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import * as XLSX from "xlsx"
import { useToast } from "@/components/ui/use-toast"

interface ExportDataProps {
  equipmentData: any[]
  movementsData: any[]
}

export function ExportData({ equipmentData, movementsData }: ExportDataProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const exportToPDF = async (dataType: "equipment" | "movements") => {
    setIsLoading(true)
    try {
      const doc = new jsPDF()
      const title = dataType === "equipment" ? "Reporte de Equipos" : "Reporte de Movimientos"
      const data = dataType === "equipment" ? equipmentData : movementsData

      // Añadir título
      doc.setFontSize(18)
      doc.text(title, 14, 22)
      doc.setFontSize(11)
      doc.text(`Fecha: ${new Date().toLocaleDateString("es-ES")}`, 14, 30)

      // Configurar columnas según el tipo de datos
      if (dataType === "equipment") {
        // @ts-ignore
        doc.autoTable({
          startY: 40,
          head: [["Código", "Nombre", "Tipo", "Estado", "Asignado a", "Fecha Adquisición"]],
          body: data.map((item) => [
            item.codigo,
            item.nombre,
            item.tipo,
            item.estado,
            item.persona_nombre ? `${item.persona_nombre} ${item.persona_apellido}` : "No asignado",
            item.fecha_adquisicion ? new Date(item.fecha_adquisicion).toLocaleDateString("es-ES") : "N/A",
          ]),
        })
      } else {
        // @ts-ignore
        doc.autoTable({
          startY: 40,
          head: [["Fecha", "Equipo", "Tipo", "Persona", "Detalles"]],
          body: data.map((item) => {
            let persona = "N/A"
            if (item.tipo_movimiento === "Salida" && item.persona_nombre) {
              persona = `${item.persona_nombre} ${item.persona_apellido}`
            } else if (item.tipo_movimiento === "Transferencia") {
              persona = `De: ${item.persona_origen_nombre || "N/A"} A: ${item.persona_destino_nombre || "N/A"}`
            }

            return [
              new Date(item.fecha_movimiento).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
              `${item.equipo_codigo} - ${item.equipo_nombre}`,
              item.tipo_movimiento,
              persona,
              item.notas || "Sin detalles",
            ]
          }),
        })
      }

      // Guardar el PDF
      doc.save(`${dataType === "equipment" ? "equipos" : "movimientos"}_${Date.now()}.pdf`)

      toast({
        title: "Exportación completada",
        description: `El reporte de ${dataType === "equipment" ? "equipos" : "movimientos"} ha sido exportado a PDF.`,
      })
    } catch (error) {
      console.error("Error al exportar a PDF:", error)
      toast({
        title: "Error al exportar",
        description: "No se pudo completar la exportación a PDF.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const exportToExcel = async (dataType: "equipment" | "movements") => {
    setIsLoading(true)
    try {
      const title = dataType === "equipment" ? "Reporte de Equipos" : "Reporte de Movimientos"
      const data = dataType === "equipment" ? equipmentData : movementsData

      // Preparar los datos para Excel
      let worksheetData = []

      if (dataType === "equipment") {
        worksheetData = [
          ["Código", "Nombre", "Tipo", "Estado", "Asignado a", "Fecha Adquisición"],
          ...data.map((item) => [
            item.codigo,
            item.nombre,
            item.tipo,
            item.estado,
            item.persona_nombre ? `${item.persona_nombre} ${item.persona_apellido}` : "No asignado",
            item.fecha_adquisicion ? new Date(item.fecha_adquisicion).toLocaleDateString("es-ES") : "N/A",
          ]),
        ]
      } else {
        worksheetData = [
          ["Fecha", "Equipo", "Tipo", "Persona", "Detalles"],
          ...data.map((item) => {
            let persona = "N/A"
            if (item.tipo_movimiento === "Salida" && item.persona_nombre) {
              persona = `${item.persona_nombre} ${item.persona_apellido}`
            } else if (item.tipo_movimiento === "Transferencia") {
              persona = `De: ${item.persona_origen_nombre || "N/A"} A: ${item.persona_destino_nombre || "N/A"}`
            }

            return [
              new Date(item.fecha_movimiento).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
              `${item.equipo_codigo} - ${item.equipo_nombre}`,
              item.tipo_movimiento,
              persona,
              item.notas || "Sin detalles",
            ]
          }),
        ]
      }

      // Crear libro y hoja de trabajo
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, title)

      // Guardar el archivo Excel
      XLSX.writeFile(workbook, `${dataType === "equipment" ? "equipos" : "movimientos"}_${Date.now()}.xlsx`)

      toast({
        title: "Exportación completada",
        description: `El reporte de ${dataType === "equipment" ? "equipos" : "movimientos"} ha sido exportado a Excel.`,
      })
    } catch (error) {
      console.error("Error al exportar a Excel:", error)
      toast({
        title: "Error al exportar",
        description: "No se pudo completar la exportación a Excel.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          Exportar Datos
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => exportToPDF("equipment")} disabled={isLoading}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Exportar Equipos a PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToExcel("equipment")} disabled={isLoading}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Exportar Equipos a Excel</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToPDF("movements")} disabled={isLoading}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Exportar Movimientos a PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToExcel("movements")} disabled={isLoading}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Exportar Movimientos a Excel</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
