/**
 * Chart - Reusable pie/bar chart component for data visualization
 * Props: data, type?, height?, showLegend?
 */

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

interface ChartData {
  name: string
  value: number
  color?: string // Optional custom color for this data point
}

interface ChartProps {
  data: ChartData[]
  type?: 'pie' | 'bar'
  height?: number
  showLegend?: boolean
}

// Our color palette
const COLORS = [
  '#007A7A', // Deep teal (our primary brand color)
  '#FFBF40', // Warm amber (our accent color)
  '#10B981', // Green (success/positive)
  '#F59E0B', // Yellow/orange
  '#EF4444', // Red (warnings/over budget)
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#84CC16', // Lime
]

export function Chart({ data, type = 'pie', height = 300, showLegend = true }: ChartProps) {
  // Show a nice empty state when we don't have data to display
  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center text-muted-foreground bg-muted/10 rounded-lg border-2 border-dashed border-muted"
        style={{ height }}
      >
        No data available
      </div>
    )
  }

  if (type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          {showLegend && <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />}
        </PieChart>
      </ResponsiveContainer>
    )
  }

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          {showLegend && <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />}
          {showLegend && <Legend />}
          <Bar dataKey="value" fill={COLORS[0]} radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return null
}