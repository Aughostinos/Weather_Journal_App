const sql = require('mssql');

// Create a new feedback entry
const createFeedback = async (feedback) => {
  const query = 'INSERT INTO [feedback] (UserID, FeedbackText) VALUES (@UserID, @FeedbackText);';
  const request = new sql.Request();
  request.input('UserID', sql.Int, feedback.UserID);
  request.input('FeedbackText', sql.Text, feedback.FeedbackText);
  const result = await request.query(query);
  return result;
};

module.exports = {
  createFeedback
};
