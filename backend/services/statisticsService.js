const connectionMySQL = require("./../connectionMySQL");

function getCurrentQuestionForUser(userId) {
  return new Promise((resolve, reject) => {
    const sql = `select current_question_id from users_questions where user_id = ?`;
    connectionMySQL.query(sql, [userId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows.length > 0 ? rows[0] : null);
    });
  });
}

module.exports = {
  getCurrentQuestionForUser,
};
