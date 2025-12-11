"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { EquipmentCountByStatus, EquipmentCountByType } from "@/lib/supabase/schema"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Sector,
  LabelList,
} from "recharts"
import { useState } from "react"

interface ReportsChartsProps {
  equipmentByStatus: EquipmentCountByStatus[]
  equipmentByType: EquipmentCountByType[]
}

// Paleta de colores Neon
const COLORS_STATUS = ["#8b5cf6", "#06b6d4", "#f472b6", "#34d399", "#fbbf24", "#ef4444"]
const COLORS_TYPE = ["#8b5cf6", "#06b6d4", "#f472b6", "#34d399", "#fbbf24", "#ef4444", "#a855f7", "#3b82f6"]

// Componente para renderizar el sector activo en el gráfico de pastel
const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? "start" : "end"

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#fff" className="text-sm font-bold drop-shadow-md">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        className="drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" strokeWidth={2} />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#fff" className="text-xs font-medium">
        {`${value} equipos`}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#94a3b8" className="text-xs">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  )
}

export function ReportsCharts({ equipmentByStatus, equipmentByType }: ReportsChartsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const statusData = equipmentByStatus.map((item) => ({
    name: item.estado,
    value: item.cantidad,
  }))

  const typeData = equipmentByType.map((item) => ({
    name: item.tipo,
    value: item.cantidad,
  }))

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  // Función para personalizar el tooltip
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 backdrop-blur-xl p-3 border border-white/10 rounded-xl shadow-2xl">
          <p className="font-medium text-white">{`${payload[0].name}`}</p>
          <p className="text-sm text-gray-300">{`${payload[0].value} equipos`}</p>
          <p className="text-xs text-primary">{`${((payload[0].value / statusData.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="dashboard-card border-none bg-gradient-to-b from-white/5 to-transparent">
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-tight">Equipos por Estado</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeShape={renderActiveShape}
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                onMouseEnter={onPieEnter}
                paddingAngle={4}
                stroke="none"
                {...({ activeIndex } as any)}
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS_STATUS[index % COLORS_STATUS.length]}
                    className="hover:opacity-80 transition-opacity duration-300"
                  />
                ))}
              </Pie>
              <Tooltip content={customTooltip} />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: "20px" }}
                formatter={(value) => <span className="text-sm font-medium text-muted-foreground ml-1">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="dashboard-card border-none bg-gradient-to-b from-white/5 to-transparent">
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-tight">Equipos por Tipo</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={typeData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
              barSize={40}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                label={{ value: "Cantidad", angle: -90, position: "insideLeft", style: { textAnchor: "middle", fill: "#94a3b8" } }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                formatter={(value) => [`${value} equipos`, "Cantidad"]}
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                  backdropFilter: "blur(12px)",
                  color: "#fff"
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {typeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS_TYPE[index % COLORS_TYPE.length]}
                    className="hover:opacity-80 transition-opacity duration-300"
                  />
                ))}
                <LabelList dataKey="value" position="top" fill="#94a3b8" fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
