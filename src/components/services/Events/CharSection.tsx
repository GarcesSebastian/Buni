"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

interface ChartSectionProps {
  title: string
  description?: string
  data: Array<{ name: string; value: string | number }>
  type: "pie" | "bar"
  colors: string[]
  totalLabel?: string
  totalValue?: number
}

export function ChartSection({ 
  title, 
  description, 
  data, 
  type, 
  colors, 
  totalLabel, 
  totalValue
}: ChartSectionProps) {
  const hasData = data && data.length > 0

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-4">
        <div>
          <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
          {description && <CardDescription className="text-sm">{description}</CardDescription>}
        </div>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                {type === "pie" ? (
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                ) : (
                  <BarChart data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill={colors[0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
            {totalLabel && totalValue !== undefined && (
              <div className="mt-4 text-center">
                <p className="text-sm font-medium">
                  {totalLabel}: {totalValue}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] bg-muted/20 rounded-md">
            <p className="text-muted-foreground mb-2">No hay datos disponibles</p>
            <p className="text-xs text-muted-foreground">No se encontraron registros para mostrar en la gráfica</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}