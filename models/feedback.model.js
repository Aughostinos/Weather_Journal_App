const sql = require('mssql');

// Create a new feedback entry
const createFeedback = async (feedback) => {
  // SQL query to insert feedback into the feedback table
  const query = 'INSERT INTO [feedback] (UserID, FeedbackText) VALUES (@UserID, @FeedbackText);';
  
  // Create a new SQL request
  const request = new sql.Request();
  
  // Add input parameters to the request
  request.input('UserID', sql.Int, feedback.UserID);
  request.input('FeedbackText', sql.Text, feedback.FeedbackText);
  
  // Execute the query and get the result
  const result = await request.query(query);
  
  // Return the result
  return result;
};

module.exports = {
  createFeedback
};
