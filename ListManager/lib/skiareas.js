/*  Week 6 - REST API's
 *  skiareas.js
 *  Peter Caliandro
 *  ITC 230, Spring 2018
 */

/*  This module serves as a data module, encapsulating methods for accessing
 *  the listmanager database.
 */


const SkiAreas = require("../models/SkiArea.js");



/*  Return the entire collection of SkiArea objects currently stored in the
 *  database as an array.
 */
exports.getAll  =  (callback) => {
    SkiAreas.find({}, (err, allSkiAreas) => {
        if (err) {
            return err;
        }

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
        });
        
        allSkiAreas  =  allSkiAreas.map((skiArea) => {
            return {
                Name         : skiArea.Name,
                SearchString : skiArea.SearchString,
                Region       : skiArea.Region,
                Country      : skiArea.Country,
                Latitude     : skiArea.Latitude,
                Top          : skiArea.Top,
                Base         : skiArea.Base,
                Website      : skiArea.Website,
                Article      : skiArea.Article
            };  //  in other words, don't send back to the client unnecessary properties such as _id
        });
        
        callback(allSkiAreas);
    });
};


/*  Return from the database a single SkiArea object whose Name is a case-
 *  insensitive match to the name parameter.  If no matching SkiArea is found,
 *  then return undefined.
 */
exports.find  =  (name) => {
    return SkiAreas.find({Name : {$regex : new RegExp(`^${name}$`, "i")}}, (err, skiArea) => {  //  The $regex expression here creates a regular expression that enables case-insensitive searching.  It might result in a slower search that does not take advantage of indexing?
        if (err) {
            return err;
        }
        return skiArea;
    });
};


/*  Given a SkiArea object newSkiArea, use its Name property to search the database
 *  for a SkiArea with the same name.  If one is found, then replace that object
 *  with newSkiArea.  If one is not found, then add newSkiArea to the database.
 */
exports.addOrUpdate  = (newSkiArea) => {
    newSkiArea.SearchString = encodeURIComponent(newSkiArea.Name);  //  Add one more property to the newSkiArea object.
    
    SkiAreas.findOneAndUpdate(
        SkiAreas.find({Name : {$regex : new RegExp(`^${newSkiArea.Name}$`, "i")}}),  //  This expression returns a Query object
        newSkiArea,
        {upsert : true},  //  object storing options
        (err, result) => {  //  Note that without this callback function, findOneAndUpdate() will only return its query, and not execute it.
            if (err) {
                throw err;
            }
            //  Callback function call to go here when this is added as a route in index.js.
        }
    );
};


/*  Search the database for a SkiArea object whose Name is a case-insensitive
 *  match to the name parameter that is passed in.  If one is found, then delete
 *  it from the database, but also return the found SkiArea object to the caller
 *  via the callback function.  If one is not found, then return undefined via
 *  the callback function.
 */
exports.delete  =  (name, callback) => {
    SkiAreas.findOneAndRemove(
        SkiAreas.find({Name : {$regex : new RegExp(`^${name}$`, "i")}}),  //  This expression returns a Query object
        (err, skiArea) => {
            if (err) {
                throw err;
            }
            callback(skiArea);  //  So this is how it's done!!!
        }
    );
};
