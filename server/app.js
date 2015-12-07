var express = require('express');
//var multer = require('multer');
//var upload = multer({ dest: './uploads/'});
var app = express();

var path = require('path');
var bodyParser = require('body-parser');

var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/jewelry_tracker';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({expanded: true}));

//app.use(multer({ dest: './uploads/',
//    filename: function (req, file, cb) {
//        cb(null, file.originalname)
//    },
//    onFileUploadStart: function (file) {
//        console.log(file.originalname + ' is starting ...');
//    },
//    onFileUploadComplete: function (file) {
//        console.log(file.fieldname + ' uploaded to  ' + file.path)
//    }
//}).single('photo'));

// Add a new product
app.post('/data',
    //upload.single('file'),
    function(req,res){
     //pull the data off of the request
    var newProduct = {
        "name": req.body.nameAdd,
        "url": req.body.url,
        "type": req.body.typeAdd,
        "style": req.body.styleAdd,
        "color": req.body.colorAdd,
        "stone": req.body.stoneAdd,
        "cost": req.body.currency,
        "details": req.body.detailsAdd
        //"file": req.file.originalname
    };
    console.log(newProduct);

    pg.connect(connectionString, function (err, client) {
        //SQL Query > Insert Data
        //Uses prepared statements, the $1 and $2 are placeholder variables. PSQL then makes sure they are relatively safe values and then uses them when it executes the query.
        client.query("INSERT INTO products (name, url, type, style, color, stone, cost, details) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",  //this statement works in postgresql
            [newProduct.name, newProduct.url, newProduct.type, newProduct.style, newProduct.color, newProduct.stone, newProduct.cost, newProduct.details],
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

// Get all the previous products
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

//app.get('/find', function(req,res) {
//    var results = req.query.searchProducts;
//    var query = client.query("SELECT * FROM products WHERE COLUMN details CONTAINS" + results + "ORDER BY id ASC");
//        console.log(req.query);
//
//        if(query){
//            Products.find({"details": query}, function(err, data) {
//                if (err) {
//                    console.log("Error! : ", err);
//                }
//                //console.log(data);
//                res.send(data);
//            })
//        } else {
//            Products.find({}, function (err, data) {
//                if (err) {
//                    console.log("Error! : ", err);
//                }
//                //console.log(data);
//                res.send(data);
//            })
//        }
//});


//    var results = [];
//    //console.log(results);
//    //SQL Query > SELECT data from table
//    pg.connect(connectionString, function (err, client, done) {
//        var query = client.query("SELECT * FROM products WHERE column_details CONTAINS" + results + "ORDER BY id ASC");
//
//        // Stream results back one row at a time, push into results array
//        query.on('row', function (row) {
//            results.push(row);
//        });
//        //console.log(results);
//        // After all data is returned, close connection and return results
//        query.on('end', function () {
//            client.end();
//            return res.json(results);
//        });
//
//        // Handle Errors
//        if (err) {
//            console.log(err);
//        }
//    })
//};

//app.post('/api/photo',function(req,res){
//    upload(req,res,function(err) {
//        if(err) {
//            return res.end("Error uploading file.");
//        }
//        res.end("File is uploaded");
//    });
//});

//Delete a previous product
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

//General get for all other info
app.get("/*", function(req,res){
    var file = req.params[0] || "/views/index.html";
    res.sendFile(path.join(__dirname, "./public", file));
});

//Set generic web address
app.set("port", process.env.PORT || 5000);

//Get port 5000 alternate
app.listen(app.get("port"), function(){
    console.log("Listening on port: ", app.get("port"));
});
