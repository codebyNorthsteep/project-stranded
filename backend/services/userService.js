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
  const defaultQuestionId = 1; // default id 1 för varje ny användare
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO users_questions (user_id, current_question_id)
      VALUES (?, ?);
    `;
    connectionMySQL.query(sql, [userId, defaultQuestionId], (err) => {
      if (err) return reject(err);
      resolve({
        current_question_id: defaultQuestionId,
      });
    });
  });
}


function getUserInfoById(userId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT user_id, username, email, user_img
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

function updateUser(userId, updates) {
  //1. Map incoming fields to database column names, filtrering out undefined values
  const fields = [
    ["username", updates.username],
    ["password_hash", updates.password],
    ["user_img", updates.picture],
  ].filter(([, value]) => value !== undefined);

  //2. Double-check that there is at least one column to update
  if (fields.length === 0) {
    return Promise.reject(new Error("No fields to update"));
  }

  //3. Dynamically construct SQL assignments (e.g., "username = ?, user_img = ?")
  const assignments = fields.map(([column]) => `${column} = ?`).join(", ");

  //4. Extract values in the same order as columns for parameterized query safety
  const values = fields.map(([, value]) => value);

  //5. Execute the single UPDATE query
  return new Promise((resolve, reject) => {
    connectionMySQL.query(
      `UPDATE users SET ${assignments} WHERE user_id = ?`,
      [...values, userId],
      (err, result) => {
        if (err) {
          return reject(err);
        }

        resolve(result);
      },
    );
  });
}

function deleteUser(userId) {
  return new Promise((resolve, reject) => {
    const sql = `
        DELETE FROM users WHERE user_id = ?
        `;
    connectionMySQL.query(sql, [userId], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
}

module.exports = {
  getUserByUsernameOrEmail,
  createUser,
  createUserViaSocialLogin,
  createCurrentQuestionEntryForUser,
  getUserInfoById,
  getUserByEmail,
  updateUser,
  deleteUser,
};
