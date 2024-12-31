import React, { useState } from "react";
import Categorias from "./components/categorias";
import Transacciones from "./components/transacciones";
import TransaccionesFiltradas from "./components/transaccionesFiltradas";
import General from "./components/general";
import CategoriasGastos from "./components/categoriaGastos"

function App() {
  const [visibleComponent, setVisibleComponent] = useState(""); // Estado inicial vacío

  const renderComponent = () => {
    switch (visibleComponent) {
      case "categorias":
        return <Categorias />;
      case "transacciones":
        return <Transacciones />;
      case "transaccionesFiltradas":
        return <TransaccionesFiltradas />;
      case "general":
        return <General/>;
      case "categoriaGastos":
        return <CategoriasGastos/>;
      default:
        return <h2>Selecciona una opción para mostrar</h2>; // Mensaje predeterminado
    }
  };

  return (
    <div className="App">
      <h1>Gestión Financiera</h1>
      <div>
        <button onClick={() => setVisibleComponent("categorias")}>
          Ver Categorías
        </button>
        <button onClick={() => setVisibleComponent("transacciones")}>
          Ver Transacciones
        </button>
        <button onClick={() => setVisibleComponent("transaccionesFiltradas")}>
          Ver Transacciones Filtradas
        </button>
        <button onClick={() => setVisibleComponent("general")}>
          Ver general
        </button>
        <button onClick={() => setVisibleComponent("categoriaGastos")}>
          Ver gastos por categoria
        </button>
      </div>
      <div>{renderComponent()}</div>
    </div>
  );
}

export default App;


