const sql = require('mssql');
require('dotenv').config()
// Database configuration
const config = {
    user: process.env.USER,
    password: process.env.Password,
    server: 'weatherapp.database.windows.net',
    database: 'weather_db_2024-07-09T11-39Z',
    port: 1433,
    options: {
        encrypt: true,
        enableArithAbort: true
    },
requestTimeout: 60000
};

// SQL queries to create tables
const createUserTableQuery = `
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='user' AND xtype='U')
CREATE TABLE [user] (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Username VARCHAR(255) UNIQUE NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL
);
`;

const createFeedbackTableQuery = `
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='feedback' AND xtype='U')
CREATE TABLE feedback (
    FeedbackID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    FeedbackText TEXT NOT NULL,
    TimeStamp DATETIME DEFAULT GETDATE() NOT NULL,
    FOREIGN KEY (UserID) REFERENCES [user](UserID)
);
`;

// Connect to the database and create tables if they don't exist
const connect = async () => {
    try {
        await sql.connect(config);
        console.log('Connected to db');

        // Create user table if not exists
        await sql.query(createUserTableQuery);
        console.log('User table checked/created');

        // Create feedback table if not exists
        await sql.query(createFeedbackTableQuery);
        console.log('Feedback table checked/created');
        return "success";
    } catch (err) {
        console.error('Error connecting to db or creating tables:', err);
        return err;
    }
};

module.exports = connect;