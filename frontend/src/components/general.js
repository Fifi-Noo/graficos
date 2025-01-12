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

const General = ({ fechaInicio, fechaFinal }) => {
  const [resumen, setResumen] = useState(null);
  const [error, setError] = useState(""); // Estado para manejar el error

  useEffect(() => {
    if (fechaInicio && fechaFinal) {
      const fetchData = async () => {
        try {
          const data = await getResumenTransacciones(fechaInicio, fechaFinal);
          setResumen(data);
        } catch (error) {
          console.error("Error al obtener el resumen de transacciones: ", error);
          setError("Error al obtener los datos.");
        }
      };
      fetchData();
    }
  }, [fechaInicio, fechaFinal]);

  return (
    <div>
      <h3>Comparativa de Gastos vs Ingresos</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
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

export default General;
