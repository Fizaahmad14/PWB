var express = require('express');
const bodyParser = require('body-parser'); 
var app = express();
var { connection, getUserByEmailAndPassword } = require('./data'); 
app.use(bodyParser.urlencoded({ extended: false }));

connection.connect(function(err) {
  if (err) throw err;
  console.log('DB connection established');
});

app.post('/login.html', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log('email', email, 'password', password);
  // Check if the provided email and password match the database records
  getUserByEmailAndPassword(email, password, (error, user) => {
    if (error) {
      console.error('Error checking user credentials:', error);
      res.send('An error occurred');
    } else if (user !== null) {
      //res.send('login successful');
      res.redirect('/dashboard.html');
      console.log('Login successful');
    } else {
    //  res.redirect('/login.html');
      res.redirect('/login.html');
      console.log('Wrong username or password');
    }
  });
});
/* ----------------- SIGN UP ---------------- */

app.post('/signup.html', function (req, res) {
    let username = req.body.username
    let email = req.body.email
    let password = req.body.password
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let role = req.body.role;
    if (role === 'Administrator') 
      role = 1;
    else if (role === 'Project Manager')
      role = 2;
    else if (role === 'Developer')
      role = 3;
    else if (role === 'Customer')
      role = 4;

    let userSql = `INSERT INTO User (username, email, password, role_id, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?)`;
    let userValues = [username, email, password, role, firstName, lastName];
    
    connection.query(userSql, userValues, function (err, result) {
        if (err) throw err;
    
        let userID = result.insertId; // Get the auto-generated user_id from the User table
    
        let accountSql = `INSERT INTO User_account (user_id, email, password) VALUES (?, ?, ?)`;
        let accountValues = [userID, email, password];
    
        connection.query(accountSql, accountValues, function (err, result) {
          if (err) throw err;
          console.log('User and Account data have been inserted');
          res.redirect('/login.html');
        });
    });
});
app.use(express.static('public/pages'));

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});


