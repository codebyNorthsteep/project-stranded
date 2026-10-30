const connectionMySQL = require("./../connectionMySQL"); // Import the MySQL connection

function getAllLevels() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT *
      FROM level
      ORDER BY level_id;
    `;
    connectionMySQL.query(sql, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function getQuestionsByLevel(levelId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT q.question_id, q.question_title, q.question_text, q.question_img,
             a.answer_id, a.answer_text, a.answer_img, l.env_name
      FROM questions q
      JOIN answers a ON a.question_id = q.question_id
      JOIN level l ON l.level_id = q.level_id
      WHERE q.level_id = ?
      ORDER BY q.question_id, a.answer_id;
        `;
    connectionMySQL.query(sql, [levelId], (err, rows) => {
      if (err) return reject(err);
      const questions = [];
      rows.forEach((row) => {
        const question = questions.find((q) => q.question_id === row.question_id);
        if (!question) {
          questions.push({
            question_id: row.question_id,
            question_title: row.question_title,
            question_text: row.question_text,
            question_img: row.question_img,
            level_name: row.env_name,
            answers: [],
          });
        }
        questions.forEach((q) => {
          if (q.question_id === row.question_id) {
            q.answers.push({
              answer_id: row.answer_id,
              answer_text: row.answer_text,
              answer_img: row.answer_img,
            });
          }
        });
      });
      
     resolve(questions);
    });
  });
}

function getAnswerValidation(anwerId) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT is_correct, answer_explanation
            FROM answers
            WHERE answer_id = ?;
        `;
        connectionMySQL.query(sql, [anwerId], (err, rows) => {
            if (err) return reject(err);
            resolve(rows[0]); 
        });
    });
}

function updateCurrentQuestion(userId, questionId) {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE users_questions
      SET current_question_id = ?
      WHERE user_id = ?;
    `;
    connectionMySQL.query(sql, [questionId, userId], (err, result) => {
      if (err) return reject(err);
      console.log(
        "affectedRows:",
        result.affectedRows,
        "userId:",
        userId,
        "questionId:",
        questionId,
      );
      if (result.affectedRows === 0) {
        return reject(new Error("Progress kunde inte sparas"));
      }
      resolve(result);
    });
  });
}

//funktion för att uppdatera användarens nuvarande fråga till den första frågan i nästa nivå när de har klarat en nivå
//Scenario: Användaren har klarat en nivå och vi vill uppdatera deras nuvarande fråga till den första frågan i nästa nivå. Vi antar att nivåerna är numrerade och att nästa nivå är den med det lägsta level_id som är större än den nuvarande level_id.
function completeLevel(userId, levelId) {
  return new Promise((resolve, reject) => {
    const sql = `
    update users_questions
    set current_question_id = (
      select min(q.question_id)
      from questions q
      join level l on l.level_id = q.level_id
      where l.level_id > ?
      and q.level_id = (select min(level_id) from level where level_id > ?)
    )
    where user_id = ?;
    `;

    connectionMySQL.query(sql, [levelId, levelId, userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

module.exports = {
  getAllLevels,
  getQuestionsByLevel,
  getAnswerValidation,
  updateCurrentQuestion,
  completeLevel,
};
