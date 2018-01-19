//npm install express --save
//npm install cookie-session
//npm install body-parser
//npm install ejs


var express = require('express');
var session = require('cookie-session'); // Loads the piece of middleware for sessions
var bodyParser = require('body-parser'); // Loads the piece of middleware for managing the settings
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app = express();
var fs = require('fs');


function User(name, comment) {
            this.name = name;
            this.recentComment = comment; 
    };


/* Using the sessions */
app.use(session({secret: 'todotopsecret'}))


/* If there is no to do list in the session, 
we create an empty one in the form of an array before continuing */
.use(function(req, res, next){
    if (typeof(req.session.message) == 'undefined') {
        req.session.message = [];
    }
    next();
})

/* The to do list and the form are displayed */
.get('/todo', function(req, res) { 
    res.render('todo.ejs', {message: req.session.message});
})

/* Adding an item to the to do list */
.post('/todo/add/', urlencodedParser, function(req, res) {
    var messageArr = req.session.message;
    var comment = req.body.newtodo;
    var username = req.body.name;
    
    if (req.body.newtodo != '') {
        messageArr.push(comment);
    }
    res.redirect('/todo');
    
    
    //Updates user information and adds to a separate file
    var recentUser = new User(username,comment);
    console.log(recentUser);
    
    var data = "{"+username+": "+comment+ "}";
    console.log(data);

    fs.appendFile("Users.txt", data , function(err){
        if(err){
            return console.log(err);
        }
        console.log("The user was created");
    });
    
    fs.appendFile("Users.json", data , function(err){
        if(err){
            return console.log(err);
        }
        console.log("The user was created");
    });
        
    
    
})

/* Deletes an item from the to do list */
.get('/todo/delete/:id', function(req, res) {
    if (req.params.id != '') {
        req.session.message.splice(req.params.id, 1);
    }
    res.redirect('/todo');
})

/* Redirects to the to do list if the page requested is not found */
.use(function(req, res, next){
    res.redirect('/todo');
})

.listen(8080);   