const routes = require('./routes/routes');
const express = require('express');
const connect = require('./helpers/dbconfig')
const app = express();

const bodyParser = require('body-parser')
// Here we are configuring express to use body-parser as middleware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross-origin allowance
const cors = require('cors');
app.use(cors({
   origin: '*'
}));

connect()



// Setup Server
const port = 8000;
app.use('', routes);
app.get('/', (req, res) => {
   res.json({ message: 'app listening' })
});
app.listen(port, () => {
   console.log('server running');
   console.log(`running on localhost: ${port}`);
});
