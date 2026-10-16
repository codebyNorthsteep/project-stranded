const connectionMySQL = require("./../connectionMySQL");

function getUserByUsernameOrEmail(usernameOrEmail) {
  return new Promise((resolve, reject) => {
    const sql = `
        SELECT user_id, username, email, password_hash
        FROM users 
        WHERE username = ? OR email = ?
        LIMIT 1;
        `;
    connectionMySQL.query(
      sql,
      [usernameOrEmail, usernameOrEmail],
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
};
