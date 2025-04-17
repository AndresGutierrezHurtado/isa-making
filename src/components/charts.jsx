import { Doughnut, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip);

export function LineChart({ current, last }) {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(new Date().getDate() - i);
        return date.toLocaleDateString("es-ES", { weekday: "long" });
    }).reverse();

    const currentData = Object.groupBy(current, (order) =>
        new Date(order.createdAt).toLocaleDateString("es-ES", { weekday: "long" })
    );
    const lastData = Object.groupBy(last, (order) =>
        new Date(order.createdAt).toLocaleDateString("es-ES", { weekday: "long" })
    );

    const currentDataArray = last7Days.map((day) => ({
        day,
        value: currentData[day]?.length || 0,
        money:
            currentData[day]?.reduce(
                (acc, order) => acc + parseInt(order.payment.payment_amount),
                0
            ) || 0,
    }));
    const lastDataArray = last7Days.map((day) => ({
        day,
        value: lastData[day]?.length || 0,
        money:
            lastData[day]?.reduce(
                (acc, order) => acc + parseInt(order.payment.payment_amount),
                0
            ) || 0,
    }));

    const max = Math.max(
        ...currentDataArray.map((item) => item.value),
        ...lastDataArray.map((item) => item.value)
    );

    return (
        <Line
            datasetIdKey="id"
            data={{
                labels: last7Days,
                datasets: [
                    {
                        id: 1,
                        label: "Semana actual",
                        data: currentDataArray,
                        backgroundColor: "#3b82f6",
                        borderColor: "#3b82f6",
                        borderWidth: 2,
                        tension: 0.2,
                    },
                    {
                        id: 2,
                        label: "Semana pasada",
                        data: lastDataArray,
                        backgroundColor: "#fafafa",
                        borderColor: "#fafafa",
                        tension: 0.2,
                        borderWidth: 1,
                        borderDash: [20, 20],
                    },
                ],
            }}
            options={{
                parsing: {
                    xAxisKey: "day",
                    yAxisKey: "value",
                },
                scales: {
                    x: {
                        type: "category",
                        ticks: {
                            color: "#fafafa80",
                        },
                        grid: {
                            color: "#fafafa20",
                        },
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            color: "#fafafa80",
                        },
                        grid: {
                            color: "#fafafa20",
                        },
                        max: max > 10 ? Math.ceil(max + max * 0.5) : 10,
                    },
                },
                animation: {
                    duration: 1000,
                    easing: "easeOut",
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const { day, value, money } = context.raw;
                                let label = context.dataset.label;
                                if (label) {
                                    label += ": ";
                                }
                                if (value !== null && money !== null) {
                                    label += `${value} pedidos (${money} COP)`;
                                }
                                return label;
                            },
                        },
                        intersect: false,
                    },
                },
                interaction: {
                    mode: "nearest",
                    axis: "x",
                    intersect: false,
                },
            }}
            height={100}
        />
    );
}

export function DoughnutChart({ categories }) {
    return (
        <Doughnut
            data={{
                labels: categories.map((category) => category.category_name),
                datasets: [
                    {
                        label: "Categorías",
                        data: categories.map((category) => category.products.length),
                        backgroundColor: [
                            "#3b82f6",
                            "#f87171",
                            "#34d399",
                            "#fbbf24",
                            "#818cf8",
                            "#6366f1",
                        ],
                        borderWidth: 0,
                        hoverOffset: 4,
                    },
                ],
            }}
            options={{
                layout: {
                    padding: 20,
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = context.label || "";
                                if (label) {
                                    label += ": ";
                                }
                                if (context.parsed !== null) {
                                    label += context.parsed;
                                }
                                return label;
                            },
                        },
                    },
                },
            }}
        />
    );
}
