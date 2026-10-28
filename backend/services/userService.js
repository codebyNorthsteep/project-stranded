const connectionMySQL = require("./../connectionMySQL");

function getUserByUsernameOrEmail(username, email) {
  return new Promise((resolve, reject) => {
    const sql = `
        SELECT user_id, username, email, password_hash
        FROM users 
        WHERE username = ? OR email = ?
        LIMIT 1;
        `;
    connectionMySQL.query(
      sql,
      [username, email],
      (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows.length > 0 ? rows[0] : null);
      },
    );
  });
}

function createUser (username, email, hashedPassword){
  return new Promise((resolve, reject) => {
    const sql = `
        INSERT INTO users (username, email, password_hash)
        VALUES (?, ?, ?)
        `;
    connectionMySQL.query(
      sql,
      [username, email, hashedPassword],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve({
          user_id: result.insertId,
          username,
          email
        });
      },
    );
  });
}

function createUserViaSocialLogin(username, email, hashedPassword){
  return new Promise((resolve, reject) => {
    const sql = `
        INSERT INTO users (username, email, password_hash)
        VALUES (?, ?, ?)
        `;
    connectionMySQL.query(
      sql,
      [username, email, hashedPassword],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve({
          user_id: result.insertId,
          username,
          email
        });
      },
    );
  });
}

//Create entry in users_questions table for a new user with default current_question_id = 1
function createCurrentQuestionEntryForUser(userId) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO users_questions (user_id, current_question_id)
      VALUES (?, 1);
    `;
    connectionMySQL.query(sql, [userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function getUserInfoById(userId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT user_id, username, email
      FROM users
      WHERE user_id = ?
      LIMIT 1;
    `;
    connectionMySQL.query(
      sql,
      [userId],
      (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows.length > 0 ? rows[0] : null);
      },
    );
  });
}

function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    const sql = `
        SELECT user_id, username, email
        FROM users 
        WHERE email = ?
        LIMIT 1;
        `;
    connectionMySQL.query(
      sql,
      [email],
      (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows.length > 0 ? rows[0] : null);
      },
    );
  });
}

module.exports = {
  getUserByUsernameOrEmail,
  createUser,
  createUserViaSocialLogin,
  getUserInfoById,
  getUserByEmail,
  createCurrentQuestionEntryForUser,
};
