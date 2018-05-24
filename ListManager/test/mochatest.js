/*  Week 4 - Quality Matters
 *  mochatest.js
 *  Peter Caliandro
 *  ITC 230, Spring 2018
 */

/*  Module to store unit tests to be run by Mocha.
 */


let expect   = require("chai").expect;

/*  The tests below run just fine without the following explicit importations
 *  and variable definitions, but ESLint raises an error if describe and it are
 *  not defined.
 */
let mocha    = require("mocha");
let describe = mocha.describe;
let it       = mocha.it;

let skiAreas = require("../lib/skiareas.js");


describe("Ski Areas", () => {
    
    it("get():  Gets existing Ski Area", () => {
        let result = skiAreas.get("AfriSki");
        expect(result).to.deep.equal({
            Name:         "Afriski",
            SearchString: "Afriski",
            Region:       "Maluti Mountains",
            Country:      "Lesotho",
            Latitude:     -29,
            Top:          3222,
            Base:         2917,
            Website:      "https://www.afriski.net/",
            Article:      "https://en.wikipedia.org/wiki/Afriski"
        });
    });
    
    it("get():  Fails to get non-existent Ski Area", () => {
        let result = skiAreas.get("Bousquet");
        expect(result).to.be.undefined;
    });
    
    it("add():  Adds unique Ski Area", () => {
        let newSkiArea = {
            name     : "Bousquet Mountain",
            region   : "Berkshire Hills",
            country  : "United States",
            latitude : 42,
            top      : 554,
            base     : 324,
            website  : "https://www.bousquets.com/",
            article  : "https://en.wikipedia.org/wiki/Bousquet_Ski_Area"
        };
        let result = skiAreas.add(newSkiArea);
        expect(result).to.deep.equal({
            Name         : "Bousquet Mountain",
            SearchString : "Bousquet%20Mountain",
            Region       : "Berkshire Hills",
            Country      : "United States",
            Latitude     : 42,
            Top          : 554,
            Base         : 324,
            Website      : "https://www.bousquets.com/",
            Article      : "https://en.wikipedia.org/wiki/Bousquet_Ski_Area"
        });
    });
    
    it("add():  Fails to add existing Ski Area a second time", () => {
        let newSkiArea = {
            name     : "Bousquet Mountain",
            region   : "Berkshire Hills",
            country  : "United States",
            latitude : 42,
            top      : 554,
            base     : 324,
            website  : "https://www.bousquets.com/",
            article  : "https://en.wikipedia.org/wiki/Bousquet_Ski_Area"
        };
        let result = skiAreas.add(newSkiArea);
        expect(result).to.be.undefined;
    });
    
    it("delete():  Deletes existing Ski Area", () => {
        let result = skiAreas.delete("Sky Resort");
        expect(result).to.deep.equal({
            Name         : "Sky Resort",
            SearchString : "Sky%20Resort",
            Region       : "Bogd Khan Mountain",
            Country      : "Mongolia",
            Latitude     : 48,
            Top          : 1570,
            Base         : 1379,
            Website      : "http://www.skyresort.mn/pages/%D0%B1%D0%B0%D0%B0%D0%B7%D1%8B%D0%BD-%D1%82%D0%B0%D0%BD%D0%B8%D0%BB%D1%86%D1%83%D1%83%D0%BB%D0%B3%D0%B0",
            Article      : ""
        });  //  Note that the delete() method returns the deleted skiArea object if the ski area was found and deleted, or undefined if the ski area was not found.
    });

    it("delete():  Fails to delete non-existing Ski Area", () => {
        let result = skiAreas.delete("Sky Resort");
        expect(result).to.be.undefined;
    });

});
