const mysql = require('mysql');

//establish a connection to the db
const connection = mysql.createConnection({
    host: 'weatherapp.database.windows.net',
    user: 'super_admin',
    password: 'Alx@123#',
    database: 'weather_db',
    port: 3306

});

//connect to the db
const connect = () => {
    return connection.connect(err => {
        if (err) {
            console.error('Error connecting to db:', err);
            return;
        }
        console.log('Connected to db')
    });
}
module.exports = connect;