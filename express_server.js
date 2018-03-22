var express = require('express');
var app = express();
const bodyParser = require("body-parser");

var PORT = process.env.PORT || 8080;

app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({extended: true}));

var cookieParser = require('cookie-parser')
app.use(cookieParser());

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

var urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};

// creates a random alphanumeric string
function generateRandomString() {
    return Math.random().toString(36).substr(2, 6);
}

// Home page
app.get('/urls', (req, res) => {
   // console.log('username: ', req.cookies.username);
    let templateVars = {
        urls: urlDatabase,
        user_id: users[user_id]
    };
    res.render('urls_index', templateVars);
});

// Renders a new page to add a new URL
app.get("/urls/new", (req, res) => {
    let templateVars = {
        user_id: users[user_id]
    }
    res.render("urls_new", templateVars);
});

// Creates a random shortURL and assigns it to the long URL
app.post("/urls", (req, res) => {
    let random_short_url = generateRandomString()
    urlDatabase[random_short_url] = 'http://' + req.body.longURL
    res.redirect(`/urls/${random_short_url}`);
});

// Update URL page
app.get("/urls/:id", (req, res) => {
    let templateVars = {
        shortURL: req.params.id,
        user_id: users[user_id]
    };
    res.render("urls_show", templateVars);
  });

// Redirects from shortURL to longURL
app.get("/u/:shortURL", (req, res) => {
    let longURL = urlDatabase[req.params.shortURL];
    res.redirect(longURL);
});

// Deletes URL
app.post('/urls/:id/delete', (req, res) => {
    delete urlDatabase[req.params.id];
    res.redirect('/urls');
});

// Updates the longURL
app.post('/urls/:id', (req, res) => {
    urlDatabase[req.params.id] = req.body.updatedLongURL;
    res.redirect('/urls');
});

// Login check
app.post('/login', (req, res) => {
if (req.body.email && req.body.password) {
    for (userObject in users) {
        if (userObject.email === req.body.email && userObject.password === req.body.password) {
            res.cookie('user_id', userObject.id);
            res.redirect('/urls');
        }
        else if (userObject.email === req.body.email && userObject.password !== req.body.password){
            res.status(403).send('Email or password do not match. Please try again.');
        }
        else {
            res.status(403).send('This email cannot be found. Please try again.');
        }
    };
}
else {
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
        users[user_id] = {
        id: user_id,
        email: req.body.email,
        password: req.body.password
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