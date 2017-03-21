const kindlegen = require("kindlegen");
const fs = require("fs");

exports.convertToMobi = f => new Promise((res, rej) => {
    if(f.split(".").pop() !== "epub")
        return rej(new Error("File is not epub file"));
    fs.readFile(f, (e, epub) => {
        if(e) return rej(e);
        kindlegen(epub, (err, mobi) => {
            fs.writeFile(f.slice(0,-4) + "mobi" , mobi, err => {
                if(err) return rej(err);
            });
        });
    });
});
