const db = require('../helpers/dbconfig');

// Find user by email
const findUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) return callback(err, null);
    if (results.length > 0) return callback(null, results[0]);
    return callback(null, null);
  });
};

// Create a new user
const createUser = (user, callback) => {
  const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
  db.query(query, [user.email, user.password], (err, results) => {
    if (err) return callback(err, null);
    return callback(null, results.insertId);
  });
};

module.exports = {
  findUserByEmail,
  createUser
};
