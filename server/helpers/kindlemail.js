"use strict";
const nodemailer = require("nodemailer");
const fs = require("fs");

let validateEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};
let checkFileExists = s => new Promise(r => fs.access(s, fs.F_OK, e => r(!e)));

/**
 *
 * @to[String]
 * @sender[@user[String], @pass[String]]
 * @filePath[String]
 *
 **/
exports.send = params => new Promise((rej, res) => {
    if (!validateEmail(params.sender.user) || !validateEmail(params.to)) {
        return rej(new Error("Email is not valid"));
    }
    checkFileExists(params.filePath)
        .then(result => {
            if(!result)
                return rej(new Error("File not found! - " + params.filePath));
            let transporter = nodemailer.createTransport("SMTP", {
                auth: {
                    user: params.sender.user,
                    pass: params.sender.pass
                }
            });

            let mailOptions = {
                from: "\"BookStrap\" < " + params.sender.user +">", // sender address
                to: params.to,
                attachments: [{
                    filePath: params.filePath
                }]
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return rej(error);
                }
                res(info);
            });
        }).catch(e => console.log(e));
});