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
        INSERT INTO username, email, password_hash
        VALUES (?, ?, ?)
        `;
    connectionMySQL.query(
      sql,
      [username, email, hashedPassword],
      (err, rows) => {
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

module.exports = {
  getUserByUsernameOrEmail,
};
