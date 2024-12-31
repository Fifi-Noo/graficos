const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

app.get("/categorias", async(req, res) =>{
    try {
        const result = await pool.query("SELECT * FROM categorias");
        res.json(result.rows);
    } catch (err) {
        console.error("Error al obtener los datos; ", err.message);
        res.status(500).json({error: "Ocurrio un error"});
    }
})

app.get("/transacciones", async(req, res) =>{
    try {
        const result = await pool.query("SELECT * FROM transacciones");
    
        // Formatear la fecha en formato YYYY-MM-DD antes de enviarla
        const transacciones = result.rows.map((transaccion) => ({
        ...transaccion,
        fecha: transaccion.fecha.toISOString().split("T")[0], // Solo 'YYYY-MM-DD'
        }));

        res.json(transacciones);
    } catch (err) {
        console.error("Error al obtener los datos; ", err.message);
        res.status(500).json({error: "Ocurrio un error"});
    }
})

app.get("/transaccionesFiltradas", async (req, res) => {
    try {
        const { fechaInicio, fechaFinal } = req.query;

        let query = "SELECT * FROM transacciones";
        const values = [];

        // Si hay fechas, ajustamos la consulta
        if (fechaInicio && fechaFinal) {
            query += " WHERE fecha BETWEEN $1 AND $2";
            values.push(fechaInicio, fechaFinal);
        }

        const result = await pool.query(query, values);

        // Formatear la fecha en formato YYYY-MM-DD antes de enviarla
        const transacciones = result.rows.map((transaccion) => ({
            ...transaccion,
            fecha: transaccion.fecha.toISOString().split("T")[0], // Solo 'YYYY-MM-DD'
        }));

        res.json(transacciones);
    } catch (err) {
        console.error("Error al obtener los datos; ", err.message);
        res.status(500).json({ error: "Ocurrió un error" });
    }
});

app.get("/resumenTransacciones", async (req, res) => {
    try {
        const {fechaInicio, fechaFinal} = req.query;

        if (!fechaInicio || !fechaFinal) {
            return res.status(400).json({error: "Faltan las fechas de inicio o final"});
        }

        const query = `
            SELECT tipo, SUM(monto) AS total
            FROM transacciones
            WHERE fecha BETWEEN $1 AND $2
            GROUP BY tipo
        `;

        const values = [fechaInicio, fechaFinal];
        const result = await pool.query(query, values);

        const resumen = result.rows.reduce(
            (acc, row) => {
                if(row.tipo.toLowerCase() === "gasto"){
                    acc.gastos += parseFloat(row.total);
                }else if(row.tipo.toLowerCase() === "ingreso"){
                    acc.ingresos += parseFloat(row.total);
                }
                return acc;
            },
            {ingresos: 0, gastos: 0}
        );

        res.json(resumen);
    } catch (error) {
        console.error("Error al obtener el resumen de transacciones:", err.message);
        res.status(500).json({ error: "Ocurrió un error" });
    }
})

app.get("/gastosPorCategoria", async (req, res) => {
    try {
        const { fechaInicio, fechaFinal } = req.query;

        let query = `
            SELECT c.nombre AS categoria, SUM(t.monto) AS total
            FROM transacciones t
            INNER JOIN categorias c ON t.categoria_id = c.id
            WHERE t.tipo = 'gasto'
        `;

        const values = [];

        if (fechaInicio && fechaFinal) {
            query += " AND t.fecha BETWEEN $1 AND $2";
            values.push(fechaInicio, fechaFinal);
        }

        query += " GROUP BY c.nombre ORDER BY total DESC;";

        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error("Error al obtener los gastos por categoría: ", err.message);
        res.status(500).json({ error: "Ocurrió un error" });
    }
});

app.listen(3001, () =>{
    console.log("Servidor corriendo en http://localhost:3001");
})