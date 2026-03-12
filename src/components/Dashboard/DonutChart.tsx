// src/components/Dashboard/DonutChart.tsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export function DonutChart({ data }: { data: any[] }) {
    const total = data.reduce((s, d) => s + d.value, 0)
    
    return (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1rem' }}>Distribución</h3>
            <ResponsiveContainer width='100%' height={200}>
                <PieChart>
                    <Pie
                        data={data}
                        cx='50%'
                        cy='50%'
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey='value'
                         label={({ name, percent }) => {
                            const porcentaje = percent ? (percent * 100).toFixed(0) : '0'
                            return `${name} ${porcentaje}%`
                        }}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v} tareas`]} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}