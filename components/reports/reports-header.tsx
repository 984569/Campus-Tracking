import { ExportData } from "@/components/reports/export-data"

interface ReportsHeaderProps {
  equipmentData: any[]
  movementsData: any[]
}

export function ReportsHeader({ equipmentData, movementsData }: ReportsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-1 animate-in fade-in slide-in-from-top-4 duration-500">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/50 bg-clip-text text-transparent drop-shadow-sm">
          Reportes
        </h1>
        <p className="text-muted-foreground mt-1 text-lg font-light tracking-wide">Visualiza estadísticas y genera reportes</p>
      </div>
      <div className="flex items-center gap-2">
        <ExportData equipmentData={equipmentData} movementsData={movementsData} />
      </div>
    </div>
  )
}
