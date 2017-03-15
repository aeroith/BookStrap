var mongoose = require("mongoose");
var CONFIG = require("./config.json");

// use ES6 Promises as mongoose's are deprecated
mongoose.Promise = global.Promise;
mongoose.connect(CONFIG.MONGODB_CONNECTION);
var db = mongoose.connection;
var db_server = process.env.DB_ENV || "primary";

mongoose.connection.on("connected", function(ref) {
    console.log("Connected to " + db_server + " DB!");
});
db.on("error", console.error.bind(console, "connection error:"));

// When the connection is disconnected
db.on("disconnected", function () {
    console.log("Mongoose default connection to DB :" + db_server + " disconnected");
    console.log("Trying to reconnect to DB:" + db_server + "...");
    mongoose.connect(CONFIG.MONGODB_CONNECTION);
});

mongoose.connection.on("reconnected", function(ref) {
    console.log("Reconnected to " + db_server + " DB!");
});

var Schema = mongoose.Schema;
var BookSchema = new Schema({
    author: String,
    title: String,
    description: String,
    cover: String,
    subject: Array,
    language: String,
    publisher: String,
    pubdate: String,
    rating: String,
    bookName: String,
});
const Book = mongoose.model("Book", BookSchema, CONFIG.MONGOOSE_COLLECTION);

var gracefulExit = function () {
    mongoose.connection.close(function () {
        console.log("Mongoose default connection with DB :" + db_server + " is disconnected through app termination");
        process.exit(0);
    });
};
// If the Node process ends, close the Mongoose connection
process.on("SIGINT", gracefulExit).on("SIGTERM", gracefulExit);

module.exports = Book;
