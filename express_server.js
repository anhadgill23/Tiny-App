var express = require('express');
var app = express();
const bodyParser = require("body-parser");

var PORT = process.env.PORT || 8080;

app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({extended: true}));

var cookieParser = require('cookie-parser')
app.use(cookieParser());

const bcrypt = require('bcrypt');

// Users' data object
const users = {
    "userRandomID": {
      id: "userRandomID",
      email: "user@example.com",
      password: "purple-monkey-dinosaur"
    },
   "user2RandomID": {
      id: "user2RandomID",
      email: "user2@example.com",
      password: "dishwasher-funk"
    }
}

// URL database
var urlDatabase = {
    "b2xVn2": {
        id: 'userRandomID',
        longURL: 'www.lighthouselab.com'},
    "9sm5xK": {
        id: 'user2RandomID',
        longURL: 'http://www.google.com'}
}

// Creates a random alphanumeric string
function generateRandomString() {
    return Math.random().toString(36).substr(2, 6);
}

// Authenticate user
function authenticateUser (email, password) {
    for (userObject in users) {
        if (email === users[userObject].email && bcrypt.compareSync(password, users[userObject].password)) {
            return true;
        }
    }
};

// Finds URLs specific to the user
function urlsForUser(id) {
    var userUrlDatabase = {};
    for (shortURL in urlDatabase) {
        if (urlDatabase[shortURL].id === id) {
            userUrlDatabase[shortURL] = urlDatabase[shortURL].longURL
        }
    }
    console.log('userUrlDatabase: ', userUrlDatabase);
    return userUrlDatabase;
}

// Home page
app.get('/urls', (req, res) => {
    if(req.cookies.user_id) {
        let templateVars = {
            urls: urlsForUser(req.cookies.user_id),
            user_id: users[req.cookies.user_id]
        };
        res.render('urls_index', templateVars);
    } else {
        res.redirect('/login');
    }
});

// Renders a new page to add a new URL
app.get("/urls/new", (req, res) => {
    if(req.cookies.user_id) {
        let templateVars = {
            user_id: users[req.cookies.user_id]
        }
        res.render("urls_new", templateVars);
    }
    res.redirect('/login');
});

// Creates a random shortURL and assigns it to the long URL
app.post("/urls", (req, res) => {
    let random_short_url = generateRandomString()
    console.log('urlDatabase: ', urlDatabase);

    urlDatabase[random_short_url] = {
        id: users[req.cookies.user_id].id,
        longURL: 'http://' + req.body.longURL
    }
    res.redirect(`/urls/${random_short_url}`);
});

// Update URL page
app.get("/urls/:id", (req, res) => {
    if (urlDatabase[req.params.id].id === users[req.cookies.user_id].id){
        let templateVars = {
            shortURL: req.params.id,
            user_id: users[req.cookies.user_id]
        };
        res.render("urls_show", templateVars);
    } else {
    res.status(403).send('Authorization denied.');
}
});

// Redirects from shortURL to longURL
app.get("/u/:shortURL", (req, res) => {
    let longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
});

// Deletes URL
app.post('/urls/:id/delete', (req, res) => {
    if (urlDatabase[req.params.id].id === users[req.cookies.user_id].id){
        delete urlDatabase[req.params.id];
        res.redirect('/urls');
    }
    else {
        res.status(403).send('Authorization denied.');
    }
});

// Updates the longURL
app.post('/urls/:id', (req, res) => {
    urlDatabase[ req.params.id ] = {
        id:users[req.cookies.user_id].id,
        longURL: 'http://' + req.body.updatedLongURL
    };
    res.redirect('/urls');
});

// Login check
app.post('/login', (req, res) => {
    if (req.body.email && req.body.password) {
        if (authenticateUser(req.body.email, req.body.password)) {
            res.cookie('user_id', users[userObject].id);
            res.redirect('/urls');
        } else {
            for (userObject in users) {
                if (users[userObject].email === req.body.email && !bcrypt.compareSync(password, users[userObject].password)){
                    res.status(403).send('Email or password do not match. Please try again.');
                }
                else {
                    res.status(403).send('This email cannot be found. Please try again.');
                }
            };
        }
    } else {
        res.status(400).send('Email or password cannot be empty. Please try again.');
    }
});

// Logout
app.post('/logout', (req, res) => {
    res.clearCookie("user_id");
    res.redirect('/urls');
});

// Renders a new registration page
app.get('/register', (req, res) => {
res.render('register');
});

// Performs error checks and registers the new user
app.post("/register", (req, res) => {
    if (req.body.email && req.body.password) {
        for (userObject in users) {
            if (userObject.email === req.body.email) {
                res.status(400).send('This email is already in use. Please try again.');
            }
        };

        let user_id = generateRandomString();
        const password = req.body.password;
        const hashedPassword = bcrypt.hashSync(password, 10);

        users[user_id] = {
        id: user_id,
        email: req.body.email,
        password: hashedPassword
        }

        res.cookie('user_id', users[user_id].id);
        res.redirect('/urls');
    }
    else {
        res.status(400).send('Email or password cannot be empty. Please try again.');
    }
});

// Renders a new login page
app.get('/login', (req, res) => {
    res.render('login');
});

// Where it all comes together
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});