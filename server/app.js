var express = require('express');
var app = express();

var path = require('path');
var bodyParser = require('body-parser');

var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/comments';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({expanded: true}));


// Get all the comments
app.get('/data', function(req,res){
    var results = [];

    //SQL Query > SELECT data from table
    pg.connect(connectionString, function (err, client, done) {
        var query = client.query("SELECT * FROM message");

        // Stream results back one row at a time, push into results array
        query.on('row', function (row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function () {
            //client.end()
            return res.json(results);
        });

        // Handle Errors
        if (err) {
            console.log(err);
        }
    });
});

// Add a new message
app.post('/data', function(req,res){
    // pull the data off of the request
    var newMessage = {
        "name": req.body.nameAdd,
        "comment": req.body.commentAdd
    };

    pg.connect(connectionString, function (err, client) {
        //SQL Query > Insert Data
        //Uses prepared statements, the $1 and $2 are placeholder variables. PSQL then makes sure they are relatively safe values and then uses them when it executes the query.
        client.query("INSERT INTO message (name, comment) VALUES ($1, $2) RETURNING id",
            [newMessage.name, newMessage.comment],
            function(err, result) {
                if(err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                }
                res.send(true);
            });

    });

});


app.get("/*", function(req,res){
    var file = req.params[0] || "/views/index.html";
    res.sendFile(path.join(__dirname, "./public", file));
});

app.set("port", process.env.PORT || 5000);

app.listen(app.get("port"), function(){
    console.log("Listening on port: ", app.get("port"));
});


app.delete('/data', function(req,res){
    console.log(req.body.id);

    var personID = req.body.id;

    pg.connect(connectionString, function (err, client) {
        //SQL Query > Insert Data
        //Uses prepared statements, the $1 and $2 are placeholder variables. PSQL then makes sure they are relatively safe values and then uses them when it executes the query.
        client.query("DELETE FROM message WHERE id = $1", [personID],
            function(err, result) {
                if(err) {
                    console.log("Error deleting row: ", err);
                    res.send(false)
                }
                res.send(true);
            });
    });
});
