/*  Week 5 - Database Integration
 *  index.js
 *  Peter Caliandro
 *  ITC 230, Spring 2018
 */

/*  This module serves as a Node.js web server to enable access to the skiAreas database.
 */


const express     = require("express");
const handlebars  = require("express3-handlebars").create({defaultLayout : "main"});
const skiAreas    = require("./lib/skiareas");  //  This module was custom-built for this project.


let app = express();
app.set("port", process.env.PORT || 4000);
app.use(require("body-parser").urlencoded({extended : true}));
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.use(express.static("public"));



app.get("/", (req, res, next) => {
    skiAreas.getAll().then((allSkiAreas) => {
        allSkiAreas.sort((firstSkiArea, secondSkiArea) => {
            let first  = firstSkiArea.Name.toLowerCase();
            let second = secondSkiArea.Name.toLowerCase();
            if (first < second) {
                return -1;
            } else if (second < first) {
                return 1;
            } else {
                return 0;
            }
        });  //  Note that for some reason, sorting these in skiareas.js before returning them has no effect on the returned array.
        res.render("home", {skiAreas : allSkiAreas});
    }).catch((err) => {
        return next(err);
    });
});


let getDetail = (skiAreaName, req, res, next) => {
    skiAreas.find(skiAreaName).then((foundSkiAreas) => {  //  Note that foundSkiAreas will be an array with either 0 or 1 element(s).
        let presentedSkiArea = undefined;
        if (foundSkiAreas.length) {
            presentedSkiArea = JSON.parse(JSON.stringify(foundSkiAreas[0]));
            presentedSkiArea.Latitude  =  Math.abs(foundSkiAreas[0].Latitude) + " °" + (foundSkiAreas[0].Latitude < 0  ?  "S"  :  "N");
            presentedSkiArea.Top       =  foundSkiAreas[0].Top  ?  foundSkiAreas[0].Top  + " m"  :  "";
            presentedSkiArea.Base      =  foundSkiAreas[0].Base ?  foundSkiAreas[0].Base + " m"  :  "";
        }
        res.render("detail", {skiArea : presentedSkiArea, searchName : skiAreaName});
    }).catch((err) => {
        return next(err);
    });
};


app.post("/detail", (req, res, next) => {  //  This is used when the user submits the Search form on the home page.
    getDetail(decodeURIComponent(req.body.name.trim()), req, res, next);
});

app.get("/detail", (req, res, next) => {  //  This is used when the user clicks a hyperlink in the ordered list of ski areas on the home page.
    getDetail(decodeURIComponent(req.query.name.trim()), req, res, next);
});

app.post("/delete", (req, res) => {
    let searchName     = req.body.name.trim();
    skiAreas.delete(searchName, (deletedSkiArea) => {
        skiAreas.getAll().then((allSkiAreas) => {
            res.render("deleted", {
                skiArea           : deletedSkiArea,
                skiAreasRemaining : allSkiAreas.length  +  (allSkiAreas.length === 1  ?  " ski area remains"  :  " ski areas remain"),
                searchName        : searchName
            });            
        });
    });
});

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
