const express = require("express");
const morgan = require('morgan');
const cors = require('cors');

const bodyParser = require("body-parser");

const app = express();
const port = 1337;

app.use(cors());


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded



const about = require('./routes/about');
const reports = require('./routes/about');
const register = require('./routes/register');
const login = require('./routes/about');

app.use('/', about);
app.use('/reports/week', reports);
app.use('/register', about);
app.use('/login', login);

// // don't show the log when it is test
// if (process.env.NODE_ENV !== 'test') {
//     // use morgan to log at command line
//     router.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
// }


// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message
            }
        ]
    });
});


// This is middleware called for all routes.
// Middleware takes three parameters.
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    // console.log("works") // it worked, you can see this in the terminal
    next();
});





// Start up server
app.listen(port, () => console.log(`Example API listening on port ${port}!`));
