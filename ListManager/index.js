/*  Week 4 - Quality Matters
 *  index.js
 *  Peter Caliandro
 *  ITC 230, Spring 2018
 */

/*  This module serves as a Node.js web server to enable access to the skiAreas database.
 */


const express     = require("express");
const handlebars  = require("express3-handlebars").create({defaultLayout : "main"});
//const httpStatus  = require("http-status-codes");

const skiAreas    = require("./lib/skiareas");  //  This module was custom-built for this project.

//const NOT_FOUND_1   = " was not found.\n\n\n";
//const NOT_FOUND_2   = "Make sure that you enter all applicable query terms, " +
//                      "that you spell everything correctly, " +
//                      "and that you apply the correct separators between terms.\n\n" +
//                      "Also note that all field names must be entered " +
//                      "in all lowercase letters.";
//const NO_NEW        = "No new ski area has been added.\n\n";
//const DETAILS       = "with the following details:\n\n";

let app = express();
app.set("port", process.env.PORT || 3000);
app.use(require("body-parser").urlencoded({extended : true}));
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.use(express.static("public"));


app.get("/", (req, res) => {
    res.render("home", {skiAreas : skiAreas.getAll()});
});

let getDetail  =  (searchName, res) => {
    let foundSkiArea = skiAreas.get(searchName);  //  Will be the found skiArea object or undefined
    let presentedSkiArea;
    if (foundSkiArea) {
        presentedSkiArea = JSON.parse(JSON.stringify(foundSkiArea));  //  presentedSkiArea is now a deep clone of foundSkiArea; this is necessary because of the persistence of foundSkiArea across browser page back operations combined with the fact that we have to modify one field before passing it to the detail web page
        presentedSkiArea.Latitude  =  Math.abs(foundSkiArea.Latitude) +
            " °" + (foundSkiArea.Latitude < 0  ?  "S"  :  "N");  //  Map the number property Latitude to a string property.  Negative values translate to south latitudes; positive values translate to north latitudes.
        presentedSkiArea.Top   =  foundSkiArea.Top   ?  foundSkiArea.Top  + " m"  :  "";
        presentedSkiArea.Base  =  foundSkiArea.Base  ?  foundSkiArea.Base + " m"  :  "";
    }
    
    res.render("detail", {
        skiArea    : presentedSkiArea,
        searchName : searchName
    });
};

app.get("/detail", (req, res) => {  //  This is used when the user clicks a hyperlink in the ordered list of ski areas on the home page
    getDetail(decodeURIComponent(req.query.name.trim()), res);
});

app.post("/detail", (req, res) => {  //  This is used when the user submits the Search form on the home page
    getDetail(decodeURIComponent(req.body.name.trim()), res);
});

app.post("/delete", (req, res) => {
    let searchName     = req.body.name.trim();
    let deletedSkiArea = skiAreas.delete(searchName);  //  Will be the deleted skiArea object or undefined
    res.render("deleted", {
        skiArea      : deletedSkiArea,
        skiAreaCount : skiAreas.getAll().length,
        searchName   : searchName
    });
});

//  Note:  This route was added as extra credit for a previous assignment
//app.get("/add", (req, res) => {
//    res.type("text/plain");
//    if (req.query.name === undefined) {
//        res.status(httpStatus.BAD_REQUEST);
//        res.send("A name field must be included in the query string.\n" +
//            NO_NEW + NOT_FOUND_2);
//    } else {
//        let addedSkiArea = skiAreas.add(
//            req.query.name,
//            req.query.region,
//            req.query.country,
//            req.query.latitude,
//            req.query.top,
//            req.query.base,
//            req.query.website,
//            req.query.article
//        );
//        if (addedSkiArea === undefined) {
//            res.status(httpStatus.BAD_REQUEST);
//            res.send("The ski area " + req.query.name +
//                " is already in the list, " + DETAILS +
//                JSON.stringify(skiAreas.get(req.query.name)) +
//                "\n\n" + NO_NEW);
//        } else {
//            res.send("The ski area " + req.query.name +
//                " has been added, " + DETAILS + JSON.stringify(addedSkiArea));
//        }
//    }
//});

app.get("/about", (req, res) => {
    res.render("about");
});

app.use((req, res) => {
    res.status(404);
    res.render("404");
});

app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500);
    res.render("500");
});

app.listen(app.get("port"), () => {
    console.log("Express started on http://localhost:" +
        app.get("port") + ".  Press <Ctrl+C> to terminate.");
});
