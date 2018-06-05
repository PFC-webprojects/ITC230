/*  Week 6 - REST API's
 *  SkiArea.js
 *  Peter Caliandro
 *  ITC 230, Spring 2018
 */

/*  This module integrates MongooseJS into the project, connecting the project
 *  to the locally-hosted MongoDB database "listmanager" and defining a schema
 *  for it.
 */


const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/listmanager");


const skiAreaSchema = mongoose.Schema({
    Name         : {type : String, required : true, unique : true},
    SearchString : String,
    Region       : String,
    Country      : String,
    Latitude     : Number,
    Top          : Number,
    Base         : Number,
    Website      : String,
    Article      : String
});

module.exports = mongoose.model("SkiArea", skiAreaSchema);
