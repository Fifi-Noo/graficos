import React, { useState } from "react";
import { getTransaccionesFiltradas } from "../services/api";

const TransaccionesFiltradas = () => {
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");
    const [transacciones, setTransacciones] = useState([]);

    const handleFiltrar = async () => {
        if (!fechaInicio || !fechaFinal) {
            alert("Por favor, selecciona ambas fechas."); // Validación simple
            return;
        }
        try {
            const data = await getTransaccionesFiltradas(fechaInicio, fechaFinal);
            setTransacciones(data);
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
            <h3>Resultados:</h3>
            <ul>
                {transacciones.length > 0 ? (
                    transacciones.map((transaccion) => (
                        <li key={transaccion.id}>
                            {transaccion.tipo} - ${transaccion.monto} - {transaccion.fecha}
                        </li>
                    ))
                ) : (
                    <p>No se encontraron transacciones en el rango seleccionado.</p>
                )}
            </ul>
        </div>
    );
};

export default TransaccionesFiltradas;
