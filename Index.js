const routes = require('./routes/routes');
const express = require('express');
const connect = require('./helpers/dbconfig');
const app = express();

const bodyParser = require('body-parser');

// Configure express to use body-parser as middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable CORS for cross-origin allowance
const cors = require('cors');
app.use(cors({
   origin: '*'
}));

// Connect to the database
connect();

// Setup Server
const port = process.env.PORT || 8000;

// Use the defined routes
app.use('', routes);

// Default route for the root URL
app.get('/', (req, res) => {
   res.json({ message: 'server is listening' });
});

// Start the server and listen on the specified port
app.listen(port, () => {
   console.log('server running');
   console.log(`running on localhost: ${port}`);
});
