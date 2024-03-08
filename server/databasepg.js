const { Client } = require("pg");

const client = new Client({
    host: "localhost",
    user: 'postgres',
    password: 'password',
    database: 'postgres',
    port: 5432
});

client.connect();

client.query("SELECT * FROM customer WHERE sno=$1",[2], (err, result) => {
    if (!err) {
        console.log(result.rows);
    }
    client.end 
});
