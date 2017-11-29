// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");

var mongoose = require("mongoose");
var bodyParser = require("body-parser");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
var db = require("./models");


// Initialize Express
var app = express();

//Set up express static to serve the static content
app.use(express.static("public"));
//Set up express handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Database configuration
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://heroku_th8kc4wp:a083t1tsfnqh38u5i7ci1u9jcu@ds123956.mlab.com:23956/heroku_th8kc4wp";
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI || "mongodb://heroku_th8kc4wp:a083t1tsfnqh38u5i7ci1u9jcu@ds123956.mlab.com:23956/heroku_th8kc4wp", {
    useMongoClient: true
});
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
    db.Title
        .find({})
        .then(function(dbTitle) {
            res.render("home");
            console.log(dbTitle);
        })

});

// Retrieve data from the db
app.get("/all", function(req, res) {
    // Find all results from the scrapedData collection in the db
    db.scrapedData.find({}, function(error, found) {
        // Throw any errors to the console
        if (error) {
            console.log(error);
        }
        // If there are no errors, send the data to the browser as json
        else {
            res.json(found);
        }

    });
});


// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
    // Make a request for the news section of ycombinator
    request("https://techcrunch.com/", function(error, response, html) {
        // Load the html body from request into cheerio
        var $ = cheerio.load(html);

        $(".block-content").each(function(i, element) {
            // Save the text and href of each link enclosed in the current element
            var title = $(element).children("h2").children("a").text();
            var link = $(element).children("h2").children("a").attr("href");
            var description = $(element).children("p").text();

            // If this found element had both a title and a link and a summary
            if (title && link && description) {
                // Insert the data in the scrapedData db
                db.scrapedData.insert({
                        title: title,
                        link: link,
                        description: description
                    },
                    function(err, inserted) {
                        if (err) {
                            // Log the error if one is encountered during the query
                            console.log(err);
                        } else {
                            // Otherwise, log the inserted data
                            console.log(inserted);
                        }
                    });
            }
        });

        // Send a "Scrape Complete" message to the browser
        res.send("Scrape Complete");
    });
});

// Listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
});
