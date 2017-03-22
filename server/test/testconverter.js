const conv = require("../helpers/converter");
const chai = require("chai");
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const assert = chai.assert,
    expect = chai.expect;
chai.should();
const fs = require("fs");
const validFilePath = __dirname + "/convtest.epub";

describe("Converter test", () => {
    after(function () {
        fs.unlinkSync(validFilePath.slice(0, -4) + "mobi");
    });
    it("should convert the epub to mobi", () => {
        return conv.convertToMobi(validFilePath)
            .then(() => {
                // accessSync returns undefined if file exists
                fs.accessSync(validFilePath.slice(0, -4) + "mobi");
            })
            .should.eventually.be.undefined;
    });
    it("should check file extension", () => {
        return conv.convertToMobi("invalid.epb")
            .should.be.rejectedWith("File is not epub file");
    });
    it("should give error for not existing file", () => {
        return conv.convertToMobi("invalid.epub")
            .should.be.rejectedWith("ENOENT");
    });
});