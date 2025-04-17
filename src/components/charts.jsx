import { Doughnut, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement);

export function DoughnutChart() {
    return (
        <Doughnut
            data={{
                labels: ["Producto 1", "Producto 2", "Producto 3"],
                datasets: [{ data: [120, 200, 300] }],
            }}
        />
    );
}

export function LineChart() {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(new Date().getDate() - i);
        return date.toLocaleDateString("es-ES", { weekday: "long" });
    }).reverse();

    return (
        <Line
            datasetIdKey="id"
            data={{
                labels: last7Days,
                datasets: [
                    {
                        id: 1,
                        label: "Semana actual",
                        data: [3, 2, 4, 3, 5, 4, 6],
                        backgroundColor: "#3b82f6",
                        borderColor: "#3b82f6",
                        borderWidth: 2,
                        tension: 0.2,
                    },
                    {
                        id: 2,
                        label: "Semana pasada",
                        data: [2, 3, 2, 3, 2, 3, 2],
                        backgroundColor: "#fafafa",
                        borderColor: "#fafafa",
                        tension: 0.2,
                        borderWidth: 1,
                        borderDash: [20, 20],
                    },
                ],
            }}
            options={{
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
                        max: 8,
                    },
                },

                animation: {
                    duration: 1000,
                    easing: "easeOut",
                },
            }}
            height={100}
        />
    );
}
