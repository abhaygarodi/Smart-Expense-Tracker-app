import { useMemo, useState, useEffect } from "react";
import "./CategoryChart.css";

/* Category color palette */
const CATEGORY_COLORS = {
    "Food & Dining": { color: "#6366f1", bg: "#eef2ff" },
    "Transport": { color: "#f59e0b", bg: "#fffbeb" },
    "Shopping": { color: "#ec4899", bg: "#fdf2f8" },
    "Entertainment": { color: "#8b5cf6", bg: "#f5f3ff" },
    "Bills & Utilities": { color: "#06b6d4", bg: "#ecfeff" },
    "Health": { color: "#10b981", bg: "#ecfdf5" },
    "Education": { color: "#3b82f6", bg: "#eff6ff" },
    "Other": { color: "#64748b", bg: "#f8fafc" },
};

const CategoryChart = ({ expenses }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const categoryData = useMemo(() => {
        const map = {};
        expenses.forEach((exp) => {
            const cat = exp.category || "Other";
            map[cat] = (map[cat] || 0) + exp.amount;
        });
        const total = Object.values(map).reduce((s, v) => s + v, 0) || 1;
        return Object.entries(map)
            .sort((a, b) => b[1] - a[1])
            .map(([name, amount]) => ({
                name,
                amount,
                percent: Math.round((amount / total) * 100),
                ...(CATEGORY_COLORS[name] || CATEGORY_COLORS["Other"]),
            }));
    }, [expenses]);

    const totalAmount = useMemo(
        () => expenses.reduce((s, e) => s + e.amount, 0),
        [expenses]
    );

    const formatCurrency = (val) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(val);

    /* Donut geometry */
    const size = isMobile ? 140 : 180;
    const strokeW = 28;
    const r = (size - strokeW) / 2;
    const C = 2 * Math.PI * r;

    let accum = 0;
    const arcs = categoryData.map((d) => {
        const len = (d.percent / 100) * C;
        const offset = C - accum;
        accum += len;
        return { ...d, len, offset };
    });

    return (
        <div className="category-card">
            <div className="chart-card__header">
                <div className="chart-card__header-icon chart-card__header-icon--pink" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                        <path d="M22 12A10 10 0 0 0 12 2v10z" />
                    </svg>
                </div>
                <div>
                    <h3 className="chart-card__title">Category Breakdown</h3>
                    <p className="chart-card__subtitle">Where your money goes</p>
                </div>
            </div>

            {categoryData.length === 0 ? (
                <p className="category-card__empty">No data to display</p>
            ) : (
                <div className="category-card__content">
                    {/* Donut */}
                    <div className="category-card__donut-wrap" aria-hidden="true">
                        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="donut-chart">
                            {/* Background ring */}
                            <circle cx={size / 2} cy={size / 2} r={r}
                                fill="none" stroke="var(--color-border-light)" strokeWidth={strokeW} />
                            {/* Arcs */}
                            {arcs.map((arc, i) => (
                                <circle key={i}
                                    cx={size / 2} cy={size / 2} r={r}
                                    fill="none"
                                    stroke={arc.color}
                                    strokeWidth={strokeW}
                                    strokeDasharray={`${arc.len} ${C - arc.len}`}
                                    strokeDashoffset={arc.offset}
                                    strokeLinecap="round"
                                    className="donut-arc"
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                />
                            ))}
                        </svg>
                        <div className="donut-center">
                            <span className="donut-center__label">Total</span>
                            <span className="donut-center__value">{formatCurrency(totalAmount)}</span>
                        </div>
                    </div>

                    {/* Legend */}
                    <ul className="category-legend">
                        {categoryData.map((d) => (
                            <li key={d.name} className="category-legend__item">
                                <span className="category-legend__dot" style={{ background: d.color }} />
                                <span className="category-legend__name">{d.name}</span>
                                <span className="category-legend__pct">{d.percent}%</span>
                                <span className="category-legend__amount">{formatCurrency(d.amount)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export { CATEGORY_COLORS };
export default CategoryChart;
