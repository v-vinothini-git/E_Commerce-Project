const mysql = require('mysql');

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'vino_maddy15',
    port: '3306',
    database: 'herbalproducts',
    connectionLimit: '10',
});

module.exports.db = db;