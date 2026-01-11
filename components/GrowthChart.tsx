import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GrowthData {
    date: string;
    weight?: number;
    height?: number;
}

interface GrowthChartProps {
    data: GrowthData[];
    type: 'weight' | 'height';
    color: string;
}

const GrowthChart: React.FC<GrowthChartProps> = ({ data, type, color }) => {
    const formattedData = useMemo(() => {
        return data
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map(item => ({
                ...item,
                dateFormatted: new Date(item.date).toLocaleDateString()
            }));
    }, [data]);

    if (!data || data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-background-dark rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                <div className="text-center text-gray-400">
                    <span className="material-symbols-outlined text-4xl mb-2">show_chart</span>
                    <p className="text-sm">Sin datos registrados</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-64 z-10 relative">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={formattedData}
                    margin={{
                        top: 10,
                        right: 10,
                        left: -20,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                        dataKey="dateFormatted"
                        tick={{ fontSize: 10, fill: '#9ca3af' }}
                        axisLine={false}
                        tickLine={false}
                        tickMargin={10}
                    />
                    <YAxis
                        tick={{ fontSize: 10, fill: '#9ca3af' }}
                        axisLine={false}
                        tickLine={false}
                        domain={['auto', 'auto']}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '16px',
                            border: 'none',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            padding: '12px'
                        }}
                        labelStyle={{ color: '#6b7280', fontSize: '10px', marginBottom: '4px', fontWeight: 'bold', textTransform: 'uppercase' }}
                        itemStyle={{ color: color, fontSize: '14px', fontWeight: 'bold' }}
                        formatter={(value: number) => [`${value} ${type === 'weight' ? 'kg' : 'cm'}`, type === 'weight' ? 'Peso' : 'Altura']}
                    />
                    <Area
                        type="monotone"
                        dataKey={type}
                        stroke={color}
                        fill={`url(#gradient-${type})`}
                        strokeWidth={3}
                        animationDuration={1500}
                    />
                    <defs>
                        <linearGradient id={`gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GrowthChart;
