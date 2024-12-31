import React, { useState, useEffect } from "react";
import { getResumenTransacciones } from "../services/api";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Registrar todos los elementos de Chart.js necesarios
ChartJS.register(ArcElement, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale, ChartDataLabels);

const TransaccionesFiltradas = () => {
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");
    const [resumen, setResumen] = useState(null);
    const [error, setError] = useState(""); // Estado para manejar el error

    useEffect(() => {
        return () => {
            // Asegúrate de que el gráfico se destruya al desmontar el componente
            setResumen(null);
        };
    }, []);

    const handleFiltrar = async () => {
        // Validar si la fecha final es anterior a la fecha de inicio
        if (!fechaInicio || !fechaFinal) {
            setError("Por favor, selecciona ambas fechas.");
            return;
        }
        if (new Date(fechaFinal) < new Date(fechaInicio)) {
            setError("La fecha final no puede ser anterior a la fecha de inicio.");
            return;
        }

        setError(""); // Limpiar el error si las fechas son válidas

        try {
            const data = await getResumenTransacciones(fechaInicio, fechaFinal);
            setResumen(data);
        } catch (error) {
            console.error("Error al filtrar las transacciones: ", error);
        }
    };

    return (
        <div>
            <h2>Filtrar Transacciones por Fecha</h2>
            <div>
                <label>
                    Fecha Inicio:
                    <input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                    />
                </label>
                <label>
                    Fecha Final:
                    <input
                        type="date"
                        value={fechaFinal}
                        onChange={(e) => setFechaFinal(e.target.value)}
                    />
                </label>
                <button onClick={handleFiltrar}>Filtrar</button>
            </div>
            
            {/* Mostrar el error si lo hay */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <h3>Resultados:</h3>
            {resumen ? (
                <Pie
                    data={{
                        labels: ["Gastos", "Ingresos"],
                        datasets: [
                            {
                                data: [resumen.gastos, resumen.ingresos],
                                backgroundColor: ["#FF6384", "#36A2EB"],
                                hoverBackgroundColor: ["#FF6384", "#36A2EB"],
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: "top",
                            },
                            title: {
                                display: true,
                                text: "Comparativa de Gastos vs Ingresos",
                            },
                            datalabels: {
                                display: true,
                                color: "#fff", // Color de la etiqueta
                                formatter: (value) => {
                                    return `$${value.toFixed(2)}`; // Mostrar los totales con el formato de dinero
                                },
                                font: {
                                    weight: "bold", // Hacer que las etiquetas sean negritas
                                },
                            },
                        },
                    }}
                />
            ) : (
                <p>No hay datos para mostrar.</p>
            )}
        </div>
    );
};

export default TransaccionesFiltradas;