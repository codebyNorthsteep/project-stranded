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

module.exports = {
  getAllLevels,
  getQuestionsByLevel,
  getAnswerValidation,
};
