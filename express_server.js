var express = require('express');
var app = express();
var PORT = process.env.PORT || 8080;

app.set("view engine", "ejs")

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

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
    let templateVars = {urls: urlDatabase};
    res.render('urls_index', templateVars);
});

// Renders new page to add a new URL
app.get("/urls/new", (req, res) => {
    res.render("urls_new");
});

// Creates a random shortURL and assigns it to the new long URL
app.post("/urls", (req, res) => {
    let random_short_url = generateRandomString()
    urlDatabase[random_short_url] = 'http://' + req.body.longURL
    res.redirect(`/urls/${random_short_url}`);
});

// Displays the page after a new URL is added
app.get("/urls/:id", (req, res) => {
    let templateVars = { shortURL: req.params.id };
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

/* Likewise, a similar addition is required to the server routing that will handle the POST 
request to update a resource.
Add a POST route that updates a URL resource; POST /urls/:id
*/
app.post('/urls/:id/update', (req, res) => {
    console.log('req.body', req.body);
    //urlDatabase[req.params.id] = req.body
    res.redirect('/urls');
});

});

// It runs the program
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
})