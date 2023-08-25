const mysql = require('mysql');

// Konfigurasi koneksi database
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'dbname',
    port: process.env.DB_PORT || 3306,
});

// Membuka koneksi ke database
connection.connect((error) => {
    if (error) {
        console.error('Error connecting to the database:', error);
    } else {
        console.log('Connected to the database');
    }
});

module.exports = connection;
