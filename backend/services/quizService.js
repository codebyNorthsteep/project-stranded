const connectionMySQL = require("./../connectionMySQL"); // Import the MySQL connection

function getQuestionsByLevel(levelId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT q.question_id, q.question_title, q.question_text, q.question_img,
             a.answer_id, a.answer_text, a.answer_img
      FROM questions q
      JOIN answers a ON a.question_id = q.question_id
      WHERE q.level_id = ?
      ORDER BY q.question_id, a.answer_id;
        `;
    connectionMySQL.query(sql, [levelId], (err, rows) => {
      if (err) reject(err);
      const questions = [];
      rows.forEach((row) => {
        const question = questions.find((q) => q.question_id === row.question_id);
        if (!question) {
          questions.push({
            question_id: row.question_id,
            question_title: row.question_title,
            question_text: row.question_text,
            question_img: row.question_img,
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

module.exports = {
  getQuestionsByLevel,
};
