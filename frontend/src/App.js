import React, { useState } from "react";
import CategoriaIngresos from "./components/categoriaIngresos";
import CategoriaGastos from "./components/categoriaGastos";
import UsoCategoriasFiltrado from "./components/usoCategoria";
import General from "./components/general";
import TransaccionesFiltradas from "./components/transaccionesFiltradas";
import FechaBotones from "./components/FechaBotones";
import PdfGenerator from "./components/PdfGenerator";
import ExcelGenerator from "./components/ExcelGenerator";
import CsvGenerator from "./components/CsvGenerator";

function App() {
  const [visibleComponent, setVisibleComponent] = useState(""); // Estado inicial vacío
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");

  const handleFiltrar = (inicio, final) => {
    setFechaInicio(inicio);
    setFechaFinal(final);
    setVisibleComponent(""); // Reset visible component
  };

  const renderComponent = () => {
    switch (visibleComponent) {
      case "categoriaIngresos":
        return <CategoriaIngresos fechaInicio={fechaInicio} fechaFinal={fechaFinal} />;
      case "categoriaGastos":
        return <CategoriaGastos fechaInicio={fechaInicio} fechaFinal={fechaFinal} />;
      case "usoCategoria":
        return <UsoCategoriasFiltrado fechaInicio={fechaInicio} fechaFinal={fechaFinal} />;
      case "transaccionesFiltradas":
        return <TransaccionesFiltradas fechaInicio={fechaInicio} fechaFinal={fechaFinal} />;
      case "general":
        return <General fechaInicio={fechaInicio} fechaFinal={fechaFinal} />;
      case "generarPdf":
        return <PdfGenerator fechaInicio={fechaInicio} fechaFinal={fechaFinal} />;
      case "generarExcel":
        return <ExcelGenerator fechaInicio={fechaInicio} fechaFinal={fechaFinal} />;
      case "generarCsv":
        return <CsvGenerator fechaInicio={fechaInicio} fechaFinal={fechaFinal} />;
      default:
        return <h2>Selecciona una opción para mostrar</h2>; // Mensaje predeterminado
    }
  };

  return (
    <div className="App">
      <h1>Gestión Financiera</h1>
      <FechaBotones onFiltrar={handleFiltrar} setVisibleComponent={setVisibleComponent} />
      <div>{renderComponent()}</div>
    </div>
  );
}

export default App;
