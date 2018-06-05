/*  Week 6 - REST API's
 *  index.js
 *  Peter Caliandro
 *  ITC 230, Spring 2018
 */

/*  This module serves as a Node.js web server to enable access to the skiAreas database.
 */


const express     = require("express");
const handlebars  = require("express3-handlebars").create({defaultLayout : "main"});
const bodyParser  = require("body-parser");
const cors        = require("cors");
const skiAreas    = require("./lib/skiareas");  //  This module was custom-built for this project.


let app = express();
app.set("port", process.env.PORT || 4000);
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.use(express.static("public"));

let router = express.Router();

    

app.get("/", (req, res) => {
    skiAreas.getAll((foundSkiAreas) => {
        res.render("home", {skiAreas : foundSkiAreas});  
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
    let searchName = req.body.name.trim();
    skiAreas.delete(searchName, (deletedSkiArea) => {
        skiAreas.getAll((allSkiAreas) => {
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


/////////////////////////////////////////////////////////////////////////////////////////////////////


/*  This generic router.use is considered "middleware", and it applies to all 
 *  of our requests.
 */
//router.use((req, res, next) => {
//    console.log("Something is happening.");
//    next();  //  Continue to the next route . . .
//});

app.use(cors());

router.get("/", (req, res) => {
    skiAreas.getAll((foundSkiAreas) => {
        res.json(foundSkiAreas);  
    });
});

router.get("/detail/:name", (req, res) => {
    skiAreas.find(decodeURIComponent(skiAreaName = req.params.name.trim())).then((foundSkiAreas) => {  //  Note that foundSkiAreas will be an array with either 0 or 1 element(s).
        foundSkiAreas  =  foundSkiAreas.map((skiArea) => {
            return {
                Name    : skiArea.Name,
                Region  : skiArea.Region,
                Country : skiArea.Country,
                Latitude: skiArea.Latitude,
                Top     : skiArea.Top,
                Base    : skiArea.Base,
                Website : skiArea.Website,
                Article : skiArea.Article
            };  //  in other words, don't send back to the client unnecessary properties such as _id
        });
        if (foundSkiAreas.length) {
            res.json(foundSkiAreas);
        } else {
            return res.status(400).send(`No ski area by the name of "${skiAreaName}" was found.`);
        }
        
    });
});

router.get("/add/:name?/:region?/:country?/:latitude?/:top?/:base?", (req, res) => {
    let newSkiArea = {};
    
    if (req.params.name) {
        newSkiArea.Name = req.params.name.trim();
        
        if (req.params.region) {
            newSkiArea.Region = req.params.region.trim();
        }
        if (req.params.country) {
            newSkiArea.Country = req.params.country.trim();
        }
        if (req.params.latitude) {
            newSkiArea.Latitude = req.params.latitude.trim();
        }
        if (req.params.top) {
            newSkiArea.Top = req.params.top.trim();
        }
        if (req.params.base) {
            newSkiArea.Base = req.params.base.trim();
        }
        
        skiAreas.addOrUpdate(newSkiArea);
        res.json({message : newSkiArea.Name + " added"});

    } else {
        return res.status(400).send(`No Name parameter was given.&nbsp; No new ski area has been added.`);
        
    }
});

router.post("/add", (req, res) => {
    let newSkiArea = {};
    
    if (req.body.name) {
        newSkiArea.Name = req.body.name.trim();
        
        if (req.body.region) {
            newSkiArea.Region = req.body.region.trim();
        }
        if (req.body.country) {
            newSkiArea.Country = req.body.country.trim();
        }
        if (req.body.latitude) {
            newSkiArea.Latitude = req.body.latitude.trim();
        }
        if (req.body.top) {
            newSkiArea.Top = req.body.top.trim();
        }
        if (req.body.base) {
            newSkiArea.Base = req.body.base.trim();
        }
        
        skiAreas.addOrUpdate(newSkiArea);
        res.json({message : newSkiArea.Name + " added"});

    } else {
        return res.status(400).send(`No Name parameter was given.&nbsp; No new ski area has been added.`);
        
    }
});

router.get("/delete/:name", (req, res) => {  //  Must add code to handle ski area not found
    let searchName     = req.params.name.trim();
    skiAreas.delete(searchName, (deletedSkiArea) => {
        skiAreas.getAll((allSkiAreas) => {
            if (deletedSkiArea) {
                res.json({
                    skiAreaName       : deletedSkiArea.Name,
                    skiAreasRemaining : allSkiAreas.length,  //  +  (allSkiAreas.length === 1  ?  " ski area remains"  :  " ski areas remain"),
                    searchName        : searchName
                });            
            } else {
                return res.status(400).send(`No ski area by the name of "${searchName}" was found.&nbsp; No ski area was deleted.`);
//                res.json({
//                    message           : `No ski area by the name of ${searchName} was found.  No ski area was deleted.`,
//                    skiAreasRemaining : allSkiAreas.length
//                });            
            }
        });
    });
});

router.use((req, res) => {
    return res.status(400).send("not found");
});

router.use((err, req, res) => {
    return res.status(500).send("error");
});

/*  This establishes that all of the routes for the API will be prefixed with
 *  /api .
 */
app.use("/api", router);


/////////////////////////////////////////////////////////////////////////////////////////////////////


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
