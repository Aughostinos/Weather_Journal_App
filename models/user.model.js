const sql = require('mssql');

// Find user by email
const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM [user] WHERE Email = @Email';
  const request = new sql.Request();
  request.input('Email', sql.VarChar, email);
  const result = await request.query(query);
  return result.recordset[0];
};

// Create a new user
const createUser = async (user) => {
  const query = 'INSERT INTO [user] (Username, Email, PasswordHash) OUTPUT INSERTED.UserID VALUES (@Username, @Email, @PasswordHash)';
  const request = new sql.Request();
  request.input('Username', sql.VarChar, user.username);
  request.input('Email', sql.VarChar, user.email);
  request.input('PasswordHash', sql.VarChar, user.password);
  const result = await request.query(query);
  return result.recordset.length > 0 ? result.recordset[0] : null;
};

module.exports = {
  findUserByEmail,
  createUser
};
