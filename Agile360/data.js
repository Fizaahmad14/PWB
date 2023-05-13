var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    database: 'pwb',
    user: 'root',
    password: '2287'
});

function getUserByEmailAndPassword(email, password, callback) {
  console.log('email', email, 'password', password);
  const query = 'SELECT * FROM User_account WHERE email = ? AND password = ?';
  connection.query(query, [email, password], (error, results) => {
    if (error) {
      console.error('Error executing database query:', error);
      return callback(error, null);
    }
    
    // Return the first user from the results
    const user = results.length > 0 ? results[0] : null;
    console.log(user);
    callback(null, user);
  });
}

module.exports = {
  getUserByEmailAndPassword,
  connection,
};
