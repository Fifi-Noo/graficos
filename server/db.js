const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "jassohuerta",
    host: "localhost",
    port: 5432,
    database: "Finanzas"
});

module.exports = pool;