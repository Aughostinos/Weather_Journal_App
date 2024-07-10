const db = require('../helpers/dbconfig');

// Create a new feedback entry
const createFeedback = (feedback, callback) => {
  const query = 'INSERT INTO feedback (UserID, FeedbackText) VALUES (?, ?)';
  db.query(query, [feedback.UserID, feedback.FeedbackText], (err, results) => {
    if (err) return callback(err, null);
    return callback(null, results.insertId);
  });
};

module.exports = {
  createFeedback
};
