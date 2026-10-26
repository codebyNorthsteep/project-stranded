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

function updateUsername(userId, username) {
  return new Promise((resolve, reject) => {
    const sql = `
        UPDATE users
        SET username = ?
        WHERE user_id = ?
        `;
    connectionMySQL.query(sql, [username, userId], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result.affectedRows > 0);
    });
  });
}

function updatePassword(userId, hashedPassword) {
  return new Promise((resolve, reject) => {
    const sql = `
        UPDATE users
        SET password_hash = ?
        WHERE user_id = ?
        `;
    connectionMySQL.query(sql, [hashedPassword, userId], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result.affectedRows > 0);
    });
  });
}

function updatePicture(userId, picture) {
  return new Promise((resolve, reject) => {
    const sql = `
        UPDATE users
        SET user_img = ?
        WHERE user_id = ?
        `;
    connectionMySQL.query(sql, [picture, userId], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result.affectedRows > 0);
    });
  });
}

function deleteUser(userId) {
  return new Promise((resolve, reject) => {
    const sql = `
        DELETE FROM users WHERE user_id = ?
        `;
    connectionMySQL.query(sql, [userId], (err, result) => {
      if (err) reject(err);
      resolve(result.affectedRows > 0);
    });
  });
}

module.exports = {
  getUserByUsernameOrEmail,
  createUser,
  createUserViaSocialLogin,
  getUserInfoById,
  getUserByEmail,
  updateUsername,
  updatePassword, 
  updatePicture,
  deleteUser
};
