var express = require('express');
var app = express();
const bodyParser = require("body-parser");

var PORT = process.env.PORT || 8080;

app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({extended: true}));

var cookieParser = require('cookie-parser')
app.use(cookieParser());

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
        username: req.cookies['username']
    };
    res.render('urls_index', templateVars);
});

// Renders new page to add a new URL
app.get("/urls/new", (req, res) => {
    let templateVars = {
        username: req.cookies["username"]
    }
    res.render("urls_new", templateVars);
});

// Creates a random shortURL and assigns it to the new long URL
app.post("/urls", (req, res) => {
    let random_short_url = generateRandomString()
    urlDatabase[random_short_url] = 'http://' + req.body.longURL
    res.redirect(`/urls/${random_short_url}`);
});

// Displays the page after a new URL is added
app.get("/urls/:id", (req, res) => {
    let templateVars = {
        shortURL: req.params.id,
        username: req.cookies["username"]
    };
    console.log('templateVars: ', templateVars)
    res.render("urls_show", templateVars);
  });

// Redirects from shortURL to longURL
app.get("/u/:shortURL", (req, res) => {
    let longURL = urlDatabase[req.params.shortURL];
    res.redirect(longURL);
});

// Deletes short and long URL
app.post('/urls/:id/delete', (req, res) => {
    delete urlDatabase[req.params.id];
    res.redirect('/urls');
});

// Updates the longURL
app.post('/urls/:id', (req, res) => {
    urlDatabase[req.params.id] = req.body.updatedLongURL;
    res.redirect('/urls');
});

// Login
app.post('/login', (req, res) => {
    //might need to modify the way cookie is set
    res.cookie('username', req.body.username);
    //req.session.user_id = userRandomID;
    res.redirect('/urls');
});

// Logout
app.post('/logout', (req, res) => {
    res.clearCookie("username");
    res.redirect('/urls');
});

// It runs the program
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
})