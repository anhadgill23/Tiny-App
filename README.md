# Tiny-App
*This is the project for the second week of Lighthouse Labs*

# Screenshot
!["Screenshot of urls page"](https://github.com/anhadgill23/Tiny-App/blob/master/docs/urls-page.png?raw=true)

### Project Description

This three day project will have you building a web app using Node. The app will allow users to shorten long URLs much like the Google URL shortener.

## Technical Specification

*   `GET /`

    *   if user is logged in:
        *   redirect to `/urls`
    *   if user is not logged in:
        *   redirect to `/login`
*   `GET /urls`

    *   if user is not logged in:
        *   redirect to `/login`
    *   if user is logged in:
        *   returns a 200 response, HTML with:
        *   the site header
        *   a table of urls the user has created, each row:
            *   short url
            *   long url
            *   edit button
            *   delete button
        *   a link to "Create a New Short Link"
*   `GET /urls/new`

    *   if user is not logged in:
        *   returns a 402 response, HTML with:
        *   error message
        *   a link to `/login`
    *   if user is logged in:
        *   returns a 200 response, HTML with:
        *   the site header
        *   a form, which contains:
            *   text input field for the original URL
            *   submit button = `POST /urls`
*   `GET /urls/:id`

    *   if url w/ `:id` does not exist:
        *   returns a 404 response, HTML with a relevant error message
    *   if user is not logged in:
        *   returns a 402 response, HTML with a relevant error message and a link to `/login`
    *   if all is well:
        *   returns a 200 response, HTML with:
        *   the short url
        *   a form, which contains:
            *   the long url
            *   "update" button = `POST /urls/:id`
            *   "delete" button = `POST /urls/:id/delete`
*   `GET /u/:id`

    *   if url with `:id` exists:
        *   redirect to the corresponding longURL

*   `POST /urls`

    *   if user is logged in:
        *   generates a shortURL, saves the link and associates it with the user
        *   redirect to `/urls/:id`
    *   if user is not logged in:
        *   returns a 400 response, HTML with a relevant error message and a link to `/login`
*   `POST /urls/:id`

    *   if url with `:id` does not exist:
        *   returns a 400 response, HTML with a relevant error message
    *   if user is not logged in:
        *   returns a 400 response, HTML with a relevant error message and a link to `/login`
    *   if user does not match the url owner:
        *   returns a 400 response, HTML with a relevant error message
    *   if login is correct:
        *   updates the url
        *   redirect to `/urls/`
*   `GET /login`

    *   if user is logged in:
        *   redirect to `/urls`
    *   if user is not logged in:
        *   returns a 200 response, HTML with:
        *   a form which contains:
            *   input fields for email and password
            *   submit button to `POST /login`
*   `GET /register`

    *   if user is logged in:
        *   redirect to `/urls`
    *   if user is not logged in:
        *   a form, which contains:
            *   input fields for email and password
            *   "register" button = `POST /register`
*   `POST /register`

    *   if email or password are empty:
        *   returns a 402 response, with a relevant error message
    *   if email already exists:
        *   returns a 402 response, with a relevant error message
    *   if all is well:
        *   creates a user
        *   encrypts their password with `bcrypt`
        *   sets a cookie session
        *   redirect to `/urls`
*   `POST /login`

    *   if email & password params match an existing user:
        *   sets a cookie
        *   redirect to `/urls`
    *   if they don't match:
        *   returns a 401 response, HTML with a relevant error message
*   `POST /logout`

    *   clears the cookie
    *   redirect to `/urls`


## Dependencies

*   _ES6_
*   _Node_
*   _express_
*   _git_ for version control
*   _cookie-session_ for session storage
*   _bcrypt_ for password encryption
<<<<<<< HEAD

## Getting Started

*   Install all dependencies using the `npm install` command.
*   Run the developnet web server using the `node express_ser`.
=======
