import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { getGastosPorCategoria } from "../services/api";
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

const CategoriaGastos = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const [chartInstance, setChartInstance] = useState(null); // Para almacenar la instancia del gráfico

  useEffect(() => {
    return () => {
      // Limpiar datos al desmontar el componente
      setDatos(null);
      setError(null);
      // Destruir el gráfico si existe
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [chartInstance]);

  const handleFiltrar = async () => {
    if (!fechaInicio || !fechaFinal) {
      setError("Por favor, selecciona ambas fechas.");
      return;
    }

    // Verificar que la fecha final no sea anterior a la fecha de inicio
    if (new Date(fechaFinal) < new Date(fechaInicio)) {
      setError("La fecha final no puede ser anterior a la fecha de inicio.");
      return;
    }

    setError(null); // Limpiar cualquier error previo

    try {
      // Obtener los datos de gastos
      const gastos = await getGastosPorCategoria(fechaInicio, fechaFinal);
      setDatos(gastos);
    } catch (error) {
      console.error("Error al obtener los datos de gastos: ", error);
      setError("Hubo un problema al obtener los datos.");
    }
  };

  // Configuración del gráfico
  const chartData = {
    labels: datos ? datos.map((d) => d.categoria) : [],
    datasets: [
      {
        data: datos ? datos.map((d) => d.total) : [],
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Gastos por Categoría",
      },
      datalabels: {
        display: true,
        color: "#fff",
        formatter: (value) => {
          // Verificar que el valor sea un número
          if (typeof value === "number" && !isNaN(value)) {
            return `$${value.toFixed(2)}`;
          }
          return value;
        },
        font: {
          weight: "bold",
        },
      },
    },
  };

  return (
    <div>
      <h2>Filtrar Gastos por Fecha</h2>
      <div>
        <label>
          Fecha de Inicio:
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </label>
        <label>
          Fecha de Final:
          <input
            type="date"
            value={fechaFinal}
            onChange={(e) => setFechaFinal(e.target.value)}
          />
        </label>
        <button onClick={handleFiltrar}>Filtrar</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Resultados:</h3>
      {datos ? (
        <Pie
          data={chartData}
          options={chartOptions}
          ref={(chartRef) => {
            if (chartRef && chartRef.chart) {
              // Si ya existe un gráfico, destrúyelo antes de crear uno nuevo
              if (chartInstance) {
                chartInstance.destroy();
              }
              setChartInstance(chartRef.chart);
            }
          }}
        />
      ) : (
        <p>No hay datos para mostrar.</p>
      )}
    </div>
  );
};

export default CategoriaGastos;