//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const req = require("express/lib/request");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//TODO

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

//////////////////     Request targetting all articles     /////////////////////

app.route("/articles")
    // Fetches the full foundarticles
    .get(function(req, res) {
        Article.find(function(err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })
    // Creates items in corresponding Database
    .post(function(req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function(err) {
            // Error Report
            if (!err) {
                res.send("Successfully Sent!");
            } else {
                res.send(err);
            }
        });
    })
    // Deletes the entire article
    .delete(function(req, res) {
        Article.deleteMany(function(err) {
            if (!err) {
                res.send("Successfully deleted all articles !");
            } else {
                res.send(err);
            }
        });
    });

////////////////     Request targetting specific articles     //////////////////

app.route("/articles/:articleTitle")
    // Fetches only selected article
    .get(function(req, res) {
        Article.findOne({ title: req.params.articleTitle }, function(err, foundArticles) {
            if (foundArticles) {
                res.send(foundArticles);
            } else {
                res.send("No articles found!");
            }
        });
    })
    // Make changes to entire selected article
    .put(function(req, res) {
        Article.updateOne({ title: req.params.articleTitle }, // Updating Title
            { title: req.body.title, content: req.body.content }, // Also updating body elements with new content
            { overwrite: true }, // This enables Overwrite
            function(err) {
                if (!err) {
                    res.send("Successfully updated the changes!");
                }
            }
        );
    })
    // Changes only specific part of selected article
    .patch(function(req, res) {
        Article.updateMany({ title: req.params.articleTitle }, { $set: req.body }, // User will change title & contents
            function(err) {
                if (!err) {
                    res.send("Successfully updated the changes!");
                } else {
                    res.send(err);
                }
            }
        );
    })
    // Deletes only selected article
    .delete(function(req, res) {
        Article.deleteOne({ title: req.params.articleTitle },
            function(err) {
                if (!err) {
                    res.send("Successfully deleted article !");
                } else {
                    res.send(err);
                }
            });
    });

app.listen(3000, function() {
    console.log("Server started on port 3000");
});