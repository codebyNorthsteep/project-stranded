const connectionMySQL = require("./../connectionMySQL");

function getCurrentQuestionForUser(userId) {
  return new Promise((resolve, reject) => {
    //Hämta den aktuella frågan för användaren och dess nivå från databasen med en left join mellan users_questions och questions tabellerna
    const sql = `select uq.current_question_id, q.level_id as current_level_id
     from users_questions uq
     left join questions q on uq.current_question_id = q.question_id 
     where uq.user_id = ?`;
    connectionMySQL.query(sql, [userId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows.length > 0 ? rows[0] : null);
    });
  });
}

module.exports = {
  getCurrentQuestionForUser,
};
