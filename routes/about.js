var express = require('express');
var router = express.Router();
require('dotenv').config();

const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs'); // for password incryption
const jwt = require('jsonwebtoken'); // for sessions
//
// connect to database
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/texts.sqlite');


router.get('/', function(req, res, next) {
    const data = {
        data: {
            name: "Johanna Attefalk",
            info: "Presentation av mig själv. FYLL PÅ MER!"
        }
    };

    res.json(data);
});

router.get('/reports/week/:id', function(req, res, next) {
    // get right week from database
    let kmom = req.params.id;

    console.log(req.params.id); // ex kmom01

    //get right week from db

    db.all("SELECT report FROM reports WHERE kmom = ?", kmom, (err, result) => {
        if (err) throw err;
        console.log("result from db: ");
        console.log(result);
        res.json(result);

    });
});

router.get('/register', function(req, res, next) {
    console.log("register");
    console.log(req.body);
    res.json(data);
});

router.post("/register", (req, res, next) => {
    // thsi workds, I can see this in the terminal, so there is a connection
    // console.log("I've heared the POST request on register");

    // I get the entered values from the user from front end
    const email = req.body.email;
    const password = req.body.password;

    const saltRounds = 10;

    // The password needs to be incripted before inserted into the database
    // we use ccrypt to do this!
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // spara lösenord i databasen.

        db.run("INSERT INTO users (email, password) VALUES (?, ?)",
           email,
           hash, (err) => {
               if (err) {
                   return res.status(500).json({
                       errors: {
                           status: 500,
                           source: '/register',
                           detail: err.message
                       }
                   });
               };

               return res.status(201).json({
                   data: {
                       msg: 'User is now registred!'
                   }
               });
           }
       );
    }); // end bcrypt.hash()
});

router.get("/login", function(req, res, next) {
    //console.log(req.headers);

    res.json({
        headers: req.headers,
        str: "trying get login out"
    })
});

router.post('/login', function(req, res, next) {
    // the data from the login form
    // so React does not have anything to do with
    // JWT, it's all done in express.
    // I will send a true to reports page if it's
    // authorized
    const email = req.body.email;
    const password = req.body.password;

    //const token = req.headers['x-test-token'];
    //console.log("token::")
    //console.log(token);

    // get hashed password from database
    var hashedPassword = "";
    db.all("SELECT password, email FROM users", [], (err, rows) => {
        if (err) {
            throw err;
        }
    rows.forEach((row) => {
        // console.log(row.password); // I get the hashed password from db
        // console.log(row.email); //  get the email from db
        emailFromDb = row.email;
        hashedPassword = row.password;
    });
    const myPlaintextPassword = password;
    const hash = hashedPassword;

    bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
        // result = true/false if password is correct or not

       if (result) { // correct password
            const emailToken = { emailForToken: emailFromDb };

            // token is created
            const accessToken = jwt.sign(emailToken, process.env.JWT_SECRET); // { expiresIn: '1h'}
            console.log(accessToken);

            // send token back
            res.json({ accessToken: accessToken });

       } else { // wrong password
           res.json(false);
       }
       }) // end bcrypt.compare()
    }); // end db.all()
       // close the database connection
       // db.close();
});

router.get('/reports', function(req, res, next) {

    console.log("I'm in get reports");

    console.log(req.headers);

});

router.get('/newkmom', function(req, res, next) {

    db.all("SELECT * FROM reports", [], (err, rows) => {
        if (err) {
            throw err;
        }
    rows.forEach((row) => {
        console.log(row.password); // I get the hashed password from db
        console.log(row.email); // i get the email from db
        kmomFromDb = row.kmom;
        textFromDb = row.text;
    });
    console.log(kmomFromDb);
    console.log(textFromDb);
    })
});

router.post('/newkmom', function(req, res, next) {
    const kmom = req.body.kmom;
    const text = req.body.text;


    var reqBody = req.body;
    db.run(`INSERT INTO reports (kmom, report) VALUES (?,?)`,
        [req.body.kmom, req.body.text],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": err.message })
                return;
            }
        });



    // save to database tabel

});

router.post('/changekmom', function(req, res, next) {
    const kmom = req.body.kmom;
    const text = req.body.text;

    db.run(`UPDATE reports SET report = ? WHERE kmom = ?`,
        [req.body.text, req.body.kmom],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": err.message })
                return;
            }
        });

    // save to database tabel

});



module.exports = router;
