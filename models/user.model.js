const sql = require('mssql');

// Find user by email
const findUserByEmail = async (email) => {
  // SQL query to find a user by email
  const query = 'SELECT * FROM [user] WHERE Email = @Email';
  
  // Create a new SQL request
  const request = new sql.Request();
  
  // Add input parameter for email
  request.input('Email', sql.VarChar, email);
  
  // Execute the query and get the result
  const result = await request.query(query);
  
  // Return the first record from the result set
  return result.recordset[0];
};

// Create a new user
const createUser = async (user) => {
  // SQL query to insert a new user into the user table
  const query = 'INSERT INTO [user] (Username, Email, PasswordHash) OUTPUT INSERTED.UserID VALUES (@Username, @Email, @PasswordHash)';
  
  // Create a new SQL request
  const request = new sql.Request();
  
  // Add input parameters for username, email, and password hash
  request.input('Username', sql.VarChar, user.username);
  request.input('Email', sql.VarChar, user.email);
  request.input('PasswordHash', sql.VarChar, user.password);
  
  // Execute the query and get the result
  const result = await request.query(query);
  
  // Return the inserted user ID if available, otherwise return null
  return result.recordset.length > 0 ? result.recordset[0] : null;
};

module.exports = {
  findUserByEmail,
  createUser
};
