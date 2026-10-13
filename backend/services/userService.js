const connectionMySQL = require("./../connectionMySQL");

function getUserByUsernameOrEmail(usernameOrEmail) {
  return new Promise((resolve, reject) => {
    const sql = `
        SELECT id, username, email, password 
        FROM users 
        WHERE username = ? OR email = ?
        LIMIT 1;
        `;
    connectionMySQL.query(
      sql,
      [usernameOrEmail, usernameOrEmail],
      (err, rows) => {
        if (err) reject(err);
        resolve(rows.length > 0 ? rows[0] : null);
      },
    );
  });
}

module.exports = {
  getUserByUsernameOrEmail,
};
