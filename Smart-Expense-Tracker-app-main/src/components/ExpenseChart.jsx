import { useMemo } from "react";
import "./ExpenseChart.css";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const ExpenseChart = ({ expenses }) => {
    const monthlyData = useMemo(() => {
        const data = Array(12).fill(0);
        expenses.forEach((exp) => {
            data[exp.date.getMonth()] += exp.amount;
        });
        return data;
    }, [expenses]);

    const maxVal = Math.max(...monthlyData, 1);

    /* Only show months that have data + neighbors for context */
    const activeMonths = useMemo(() => {
        const hasData = new Set();
        monthlyData.forEach((v, i) => { if (v > 0) hasData.add(i); });
        if (hasData.size === 0) return Array.from({ length: 12 }, (_, i) => i);
        return Array.from({ length: 12 }, (_, i) => i);
    }, [monthlyData]);

    const formatCurrency = (val) =>
        val >= 1000
            ? `₹${(val / 1000).toFixed(val >= 10000 ? 0 : 1)}k`
            : `₹${val}`;

    /* SVG dimensions */
    const chartW = 720;
    const chartH = 220;
    const padLeft = 50;
    const padRight = 16;
    const padTop = 16;
    const padBot = 36;
    const innerW = chartW - padLeft - padRight;
    const innerH = chartH - padTop - padBot;

    const barCount = activeMonths.length;
    const gap = 8;
    const barW = Math.min(40, (innerW - gap * (barCount - 1)) / barCount);
    const totalBarsWidth = barW * barCount + gap * (barCount - 1);
    const offsetX = padLeft + (innerW - totalBarsWidth) / 2;

    /* Y-axis ticks */
    const ticks = 4;
    const yLines = Array.from({ length: ticks + 1 }, (_, i) => {
        const val = Math.round((maxVal / ticks) * i);
        const y = padTop + innerH - (innerH * i) / ticks;
        return { val, y };
    });

    return (
        <div className="chart-card">
            <div className="chart-card__header">
                <div className="chart-card__header-icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M7 16V8" /><path d="M12 16v-5" /><path d="M17 16v-8" />
                    </svg>
                </div>
                <div>
                    <h3 className="chart-card__title">Monthly Overview</h3>
                    <p className="chart-card__subtitle">Your spending across all months</p>
                </div>
            </div>

            <div className="chart-card__body">
                <svg viewBox={`0 0 ${chartW} ${chartH}`} className="bar-chart" role="img"
                    aria-label="Monthly expense bar chart">
                    <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-primary)" />
                            <stop offset="100%" stopColor="var(--color-accent)" />
                        </linearGradient>
                        <linearGradient id="barGradHover" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-primary-light)" />
                            <stop offset="100%" stopColor="var(--color-accent-light)" />
                        </linearGradient>
                        <filter id="barShadow">
                            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(99,102,241,0.25)" />
                        </filter>
                    </defs>

                    {/* Grid lines */}
                    {yLines.map(({ val, y }, i) => (
                        <g key={i}>
                            <line x1={padLeft} y1={y} x2={chartW - padRight} y2={y}
                                stroke="var(--color-border-light)" strokeWidth="1" />
                            <text x={padLeft - 8} y={y + 4} textAnchor="end"
                                className="chart-axis-label">{formatCurrency(val)}</text>
                        </g>
                    ))}

                    {/* Bars */}
                    {activeMonths.map((mi, i) => {
                        const val = monthlyData[mi];
                        const barH = val > 0 ? Math.max(4, (val / maxVal) * innerH) : 0;
                        const x = offsetX + i * (barW + gap);
                        const y = padTop + innerH - barH;

                        return (
                            <g key={mi} className="bar-group">
                                {/* Bar */}
                                {val > 0 && (
                                    <rect
                                        x={x} y={y} width={barW} height={barH}
                                        rx={barW / 4}
                                        fill="url(#barGrad)"
                                        filter="url(#barShadow)"
                                        className="bar-rect"
                                    />
                                )}
                                {/* Zero state dot */}
                                {val === 0 && (
                                    <circle cx={x + barW / 2} cy={padTop + innerH - 2} r={2.5}
                                        fill="var(--color-border)" />
                                )}
                                {/* Value tooltip */}
                                {val > 0 && (
                                    <text x={x + barW / 2} y={y - 6} textAnchor="middle"
                                        className="bar-value">{formatCurrency(val)}</text>
                                )}
                                {/* Month label */}
                                <text x={x + barW / 2} y={chartH - 8} textAnchor="middle"
                                    className="chart-month-label">{MONTH_LABELS[mi]}</text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default ExpenseChart;
