const express = require("express");
const morgan = require("morgan");
const path = require("path");
const app = express();
const Book = require("./db");
const _ = require("lodash");
const fs = require("fs");
const compression = require("compression");
const bodyParser = require("body-parser");
const parser = require("epub-metadata-parser");
const multer = require("multer");
const upload = multer({
    dest: "./client/books"
});
const helmet = require("helmet");
const async = require("async");
const SENDGRID_API_KEY = require("./config.json").SENDGRID_API_KEY;
const SENDGRID_MAIL = require("./config.json").SENDGRID_MAIL;
var helper = require("sendgrid").mail;
const converter = require("./helpers/converter");
const config = require("./config.json");
const kindleMail = require("./helpers/kindlemail");
let q = async.queue(function(task, callback) {
    console.log("hello " + task.name);
    callback();
}, 2);
const MAX_QUEUE_OPERATIONS = 10;
app.use(compression());
// Setup logger
app.use(morgan(":remote-addr - :remote-user [:date[clf]] \":method :url HTTP/:http-version\" :st" +
    "atus :res[content-length] :response-time ms"));
// Setup helmet for basic security
app.use(helmet());
// Serve static assets
app.use(express.static(path.resolve(__dirname, "..", "build")));
app.use("/books", express.static(path.resolve(__dirname, "..", "public", "Books")));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true,
    limit: 15 * 1024 * 1024
}));

app.get("/download/:author/:title/:bookName", (req, res) => {
    let file = "public/Books/" + req.params.author + "/" + req.params.title + "/" + req.params.bookName;
    res.download(file);
})

app.post("/upload", upload.single("epub"), function (req, res, next) {
    fs.rename("./" + req.file.path, "./public/Books/" + req.file.originalname, function (err) {
        if (err) {
            console.log(err);
        } else {
            addBook("./public/Books/" + req.file.originalname, "./public");
        }
    });
    res
        .status(200)
        .end();
});

app.put("/rate", (req, res) => {
    Book.findOneAndUpdate({
        author: req.body.author,
        title: req.body.title
    }, {
        $set: {
            rating: req.body.rating * 2
        }
    }, err => {
        if (err)
            res.status(400).end();
        res
            .status(200)
            .end();
    });
});

app.post("/mail", (req, res) => {
    var from_email = new helper.Email(req.body.email);
    var to_email = new helper.Email(SENDGRID_MAIL);
    var subject = "Ticket from " + req.body.name;
    var content = new helper.Content("text/plain", req.body.subject);
    var mail = new helper.Mail(from_email, subject, to_email, content);
    var sg = require("sendgrid")(SENDGRID_API_KEY);
    var newRequest = sg.emptyRequest({
        method: "POST",
        path: "/v3/mail/send",
        body: mail.toJSON()
    });
    sg.API(newRequest, function (error, response) {
        res
            .sendStatus(response.statusCode)
            .end();
    });
});

app.get("/api/authors", (req, res) => {
    Book.find({}, {
            "_id": 0
        })
        .select("author")
        .exec((err, books) => {
            if (err)
                return console.log(err);
            var newjson = [];
            _.forEach(books, (obj) => {
                newjson.push({
                    "title": obj.author
                });
            });
            res.send(_.uniqBy(newjson, "title"));
        });
});

app.get("/api/authors/:id", (req, res) => {
    Book.find({}, {
            "_id": 0
        })
        .select("author")
        .exec((err, books) => {
            if (err)
                return console.log(err);
            var newjson = [];
            _.forEach(books, (obj) => {
                newjson.push({
                    "title": obj.author
                });
            });
            var authors = _.filter(newjson, (prop) => (prop.title.startsWith(req.params.id) || prop.title.toLowerCase().startsWith(req.params.id)));
            res.send(authors);
        });
});

app.get("/api/getbook/:author/:book", (req, res) => {
    Book
        .find({
            author: req.params.author,
            title: req.params.book
        })
        .exec((err, book) => {
            if (err)
                return console.log(err);
            res.send(book);
        });
});

// Send the last added books by the count of bookCount param
app.get("/api/last/:page", (req, res) => {
    let bookCount = 6;
    Book
        .find({})
        .sort({
            "_id": -1
        })
        .skip((req.params.page - 1) * bookCount)
        .limit(bookCount)
        .exec((err, books) => {
            if (err)
                return console.log(err);
            res.send(books);
        });
});

// Send the total number of book pages
app.get("/api/total", (req, res) => {
    Book
        .find({})
        .count()
        .exec((err, count) => {
            if (err)
                return console.log(err);
            res.send(Math.ceil(count / 6).toString());
        });
});

// Get all books by their title and author
app.get("/api/books/", (req, res) => {
    Book.find({}, {
            "_id": 0
        })
        .select("title author")
        .exec((err, books) => {
            if (err)
                return console.log(err);
            var bookContent = [];
            _.forEach(books, (obj) => {
                bookContent.push({
                    "title": obj.title,
                    "description": obj.author
                });
            });
            res.send(bookContent);
        });
});

// Get all book categories
app.get("/api/categories", (req, res) => {
    Book.find({}, {
            "_id": 0
        })
        .select("subject")
        .exec((err, books) => {
            if (err)
                return console.log(err);
            let jsonData = [];
            // format the properties to fit the required format
            _.forEach(books, (obj) => {
                _.forEach(obj.subject, (prop) => {
                    jsonData.push({
                        "title": prop
                    });
                });
            });
            // remove duplicates
            res.send(_.uniqBy(jsonData, "title"));
        });
});

// Get the corresponding author info
app.get("/api/authorlist/:author", (req, res) => {
    Book.find({
            author: req.params.author
        }, {
            "_id": 0
        })
        .select("title")
        .exec((err, result) => {
            if (err)
                return console.log(err);
            res.send(result);
        });
});

// Get the corresponding author and title for the required category
app.get("/api/getcategory/:category", (req, res) => {
    Book.find({
            subject: {
                $in: [req.params.category]
            }
        }, {
            "_id": 0
        })
        .select("title author")
        .exec((err, result) => {
            if (err)
                return console.log(err);
            res.send(result);
        });
});

// send book to kindle device
app.post("/sendtokindle", (req, res) => {
    let checkFileExists = s => new Promise(r => fs.access(s, fs.F_OK, e => r(!e)));
    let mobiPath = `./public/Books/${req.body.author}/${req.body.title}/${req.body.bookName.slice(0, -4)}mobi`;
    if (q.length() <= MAX_QUEUE_OPERATIONS) {
        q.push({ name: req.body.title }, err => {
            res.status(200).end();
            if (err) {
                res.status(500).end();
                console.log(err);
            }
            checkFileExists(mobiPath).then(result => {
                if (!result) {
                    return converter.convertToMobi(mobiPath.slice(0, -4) + "epub");
                }
            }).then(() => {
                kindleMail.send({
                    to: config.KINDLE_MAIL,
                    sender: {
                        user: config.GMAIL_ADDRESS,
                        pass: config.GMAIL_PASSWORD,
                    },
                    filePath: `./public/Books/${req.body.author}/${req.body.title}/${req.body.bookName.slice(0, -4)}mobi`
                }).catch(e => {
                    console.log(e);
                    res.status(500).end();
                });
            });
        });
    }
    else
        res.status(500).end();
});

// Always return the main index.html, so react-router render the route in the
// client
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "build", "index.html"));
});

// A helper function to add books to database
function addBook(path, outDir) {
    parser
        .parse(path, outDir, function (book) {
            console.log(path);
            console.log(book);
            var query = {
                    author: book.author,
                    title: book.title,
                    publisher: book.publisher
                },
                update = {},
                options = {};

            Book.findOneAndUpdate(query, update, options, function (err, result) {
                if (err)
                    return console.log(err);
                console.log(result);
                if (!result) {
                    var newBook = new Book({
                        author: book.author,
                        title: book.title,
                        description: book.description,
                        cover: book.cover,
                        subject: book.subject,
                        language: book.language,
                        publisher: book.publisher,
                        pubdate: book.pubdate,
                        rating: book.rating,
                        bookName: book.fileName
                    });
                    newBook.save(function (err) {
                        if (err)
                            console.log(err);
                    });
                }
            });
        });
}

module.exports = app;