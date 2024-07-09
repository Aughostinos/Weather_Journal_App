const sql = require('mssql');

// Database configuration
const config = {
    user: 'Super_admin',
    password: 'Alx@123#',
    server: 'weatherapp.database.windows.net', 
    database: 'weather_db_2024-07-09T11-39Z',
    port: 1433,
    options: {
        encrypt: true, // Use this if you're on Windows Azure
        enableArithAbort: true
    }
};

// Connect to the database
const connect = async () => {
    try {
        await sql.connect(config);
        console.log('Connected to db');
    } catch (err) {
        console.error('Error connecting to db:', err);
    }
};

module.exports = connect;
