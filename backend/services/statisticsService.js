const connectionMySQL = require("./../connectionMySQL");
const {promisify}  = require ("util");

const query = promisify(connectionMySQL.query).bind(connectionMySQL);

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

async function saveAnswerAttempt(userId, questionId, answerId) {  const answerRows = await query(
     `SELECT is_correct
     FROM answers
     WHERE answer_id = ? AND question_id = ?`,
    [answerId, questionId],
  );

  if(answerRows.length ===0){
    return null;
  }

  await query(
    `INSERT INTO statistics (user_id, answer_id, answer_timestamp)
     VALUES (?, ?, CURRENT_TIMESTAMP)`,
     [userId,answerId],
  );

  return{
    is_correct: Boolean(answerRows[0].is_correct),
  };
  
}

module.exports = {
  getCurrentQuestionForUser,
  saveAnswerAttempt,
};
