var express = require('express');
var app = express();

var path = require('path');
var bodyParser = require('body-parser');

var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/jewelry_tracker';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({expanded: true}));

// Add a new product
app.post('/data', function(req,res){
    // pull the data off of the request
    var newProduct = {
        "type": req.body.typeAdd,
        "style": req.body.styleAdd,
        "color": req.body.colorAdd,
        "cost": req.body.currency,
        "details": req.body.detailsAdd
    };
    console.log(newProduct);

    pg.connect(connectionString, function (err, client) {
        //SQL Query > Insert Data
        //Uses prepared statements, the $1 and $2 are placeholder variables. PSQL then makes sure they are relatively safe values and then uses them when it executes the query.
        client.query("INSERT INTO products (type, style, color, cost, details) VALUES ($1, $2, $3, $4, $5) RETURNING id",  //this statement works in postgresql
            [newProduct.type, newProduct.style, newProduct.color, newProduct.cost, newProduct.details],
            function(err, result) {
                if(err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                }
                res.send(true);
                client.end();
            });
    });
});

// Get all the products
app.get('/data', function(req,res){
    var results = [];
    //console.log(results);
    //SQL Query > SELECT data from table
    pg.connect(connectionString, function (err, client, done) {
        var query = client.query("SELECT * FROM products ORDER BY id ASC");

        // Stream results back one row at a time, push into results array
        query.on('row', function (row) {
            results.push(row);
        });
        //console.log(results);
        // After all data is returned, close connection and return results
        query.on('end', function () {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if (err) {
            console.log(err);
        }
    });
});

app.delete('/data', function(req,res){
    console.log(req.body.id);

    var personID = req.body.id;

    pg.connect(connectionString, function (err, client) {
        //SQL Query > Insert Data
        //Uses prepared statements, the $1 and $2 are placeholder variables. PSQL then makes sure they are relatively safe values and then uses them when it executes the query.
        client.query("DELETE FROM products WHERE id = $1", [personID],
            function(err, result) {
                if(err) {
                    console.log("Error deleting row: ", err);
                    res.send(false)
                }
                res.send(true);
                client.end();
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
