"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { EquipmentCountByStatus, EquipmentCountByType } from "@/lib/supabase/schema"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface DashboardChartsProps {
  equipmentByStatus: EquipmentCountByStatus[]
  equipmentByType: EquipmentCountByType[]
}

const COLORS_STATUS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]
const COLORS_TYPE = ["#8b5cf6", "#ec4899", "#06b6d4", "#84cc16", "#f59e0b", "#64748b"]

export function DashboardCharts({ equipmentByStatus, equipmentByType }: DashboardChartsProps) {
  const statusData = equipmentByStatus.map((item) => ({
    name: item.estado,
    value: item.cantidad,
  }))

  const typeData = equipmentByType.map((item) => ({
    name: item.tipo,
    value: item.cantidad,
  }))

  return (
    <>
      <Card className="dashboard-card border-none bg-gradient-to-b from-white/5 to-transparent">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold tracking-tight">Equipos por Estado</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
                stroke="none"
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS_STATUS[index % COLORS_STATUS.length]}
                    className="stroke-background hover:opacity-80 transition-opacity duration-300"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                  backdropFilter: "blur(12px)",
                  color: "#fff"
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value) => <span className="text-sm font-medium text-muted-foreground ml-1">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="dashboard-card border-none bg-gradient-to-b from-white/5 to-transparent">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold tracking-tight">Equipos por Tipo</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
                stroke="none"
              >
                {typeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS_TYPE[index % COLORS_TYPE.length]}
                    className="stroke-background hover:opacity-80 transition-opacity duration-300"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                  backdropFilter: "blur(12px)",
                  color: "#fff"
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value) => <span className="text-sm font-medium text-muted-foreground ml-1">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  )
}
