const express = require('express');
const mysql = require('mysql2');
const path = require('path');
// const cons = require('consolidate');
const bcrypt = require('bcryptjs');

const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'alok9988',
  database: 'logindb',
  port: 3300,
});

const publicDir = path.join(__dirname, 'public');

app.use(express.static(publicDir));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.engine('html', cons.swig);
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'html');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('MySQL Connected...');
  }
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/login', (req, res) => {
  res.render('login');
});

// create login post request

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).render('login', {
      message: 'Please provide an email and password',
    });
  } else {
    db.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (error, result) => {
        console.log(result);
        const pwd = result && result.length > 0 ? result[0].password : '';
        if (!result || !(await bcrypt.compare(password, pwd))) {
          //   res.status(401).render('login', {
          //     message: 'Email or Password is incorrect',
          //   });

          res.status(401).json({
            status: false,
            message: 'Email or Password is incorrect',
          });
        } else {
          //   res.render('welcome');
          res.status(200).json({
            status: true,
            message: 'Login successful',
          });
        }
      }
    );
  }
});

//this is register
app.post('/auth/register', (req, res) => {
  const { name, email, password, password_confirm } = req.body;

  db.query(
    'SELECT email FROM users WHERE email = ?',
    [email],
    async (error, result) => {
      if (error) {
        console.log(error);
      }

      if (result.length > 0) {
        // return res.render('register', {
        //   message: 'This email address is already registered',
        // });
        res.status(404).json({
          status: false,
          message: 'This email address is already registered',
        });
      } else if (password !== password_confirm) {
        // return res.render('register', {
        //   message: "Password didn't match",
        // });

        res.status(401).json({
          status: false,
          message: "Password didn't match",
        });
      }

      let hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);

      db.query(
        'INSERT INTO users SET ?',
        { name: name, email: email, password: hashedPassword },
        (error, result) => {
          if (error) {
            console.log(error);
          } else {
            // return res.render('register', {
            //   message: 'User registered',
            // });
            res.status(201).json({
              status: true,
              message: 'User registered',
            });
          }
        }
      );
    }
  );
});

app.listen(5000, () => {
  console.log('Server started on Port 5000');
});
