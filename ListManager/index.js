/*  Week 2 - Let's get modular
 *  index.js
 *  Peter Caliandro
 *  ITC 230, Spring 2018
 */

/*  This module serves as a Node.js web server to enable access to the skiAreas database.
 */

const fs          = require("fs");
const http        = require("http");
const queryString = require("querystring");

const httpStatus  = require("http-status-codes");  //  This module has been downloaded from NPM and saved to this project.
const skiAreas    = require("./lib/skiareas");  //  This module was custom-built for this project.


let server = function(request, response) {
    let originalURL     = request.url;
    let path            = originalURL.replace(/\/?(?:\?.*)?$/, '').toLowerCase();  //  to enable case-insensitive routing
    let responseContent = "";  //  This default value will be tested for later on.
    
    const CONTENT_HTML  = "text/html";
    const CONTENT_PLAIN = "text/plain";
    let   contentType;  //  will usually be either "text/html" or "text/plain".
    let   statusCode;  //  This will be one of the constants pre-defined in the http-status-codes NPM module.

    let sendResponse    = function(code, type, content) {
        response.writeHead(code, { "Content-Type" : type });
        response.end(content);
    };  //  function for sending a web page to the client based on parameters that will be set mostly in the switch block below

    const GET           = "/get";
    const DELETE        = "/delete";
    const ADD           = "/add";
    let   query         = function(queryType, URL) {
        return  queryString.parse(URL.replace(new RegExp(queryType + "\\?", "i"), ""));
    };  //  Remove the path (such as GET or DELETE as defined above) and the question mark from the start of the query string.
        //  Then parse the remainder of the query string into an object.
    let   searchTerm;
    let   searchResult;

    const NOT_FOUND_1   = " was not found.\n\n\n";
    const NOT_FOUND_2   = "Make sure that you enter all applicable query terms, " +
                          "that you spell everything correctly, " +
                          "and that you apply the correct separators between terms.\n\n" +
                          "Also note that all field names must be entered " +
                          "in all lowercase letters.";
    const NO_NEW        = "No new ski area has been added.\n\n";
    const DETAILS       = "with the following details:\n\n";

    switch(path) {  //  Depending on the original value for path, reset the path, and set the contentType and the statusCode.
        case "":
        case "/home.html":
        case "/home":
        case "/index.html":
        case "/index":
            path        = "/public/home.html";
            contentType = CONTENT_HTML;
            statusCode  = httpStatus.OK;
            break;
        case "/about.html":
        case "/about":
            path        = "/public/about.html";
            contentType = CONTENT_HTML;
            statusCode  = httpStatus.OK;
            break;
        case GET:
            path             = "";  //  This route will not result in a pre-written HTML page being displayed.
            searchTerm       = query(GET, originalURL).name;  //  Extract the search term from the query string.
            responseContent  = "Here is information about " + searchTerm + ":\n\n";
            searchResult     = skiAreas.get(searchTerm);  //  Look up searchTerm among the ski areas.
            responseContent += searchResult ? JSON.stringify(searchResult) :
                               searchTerm + NOT_FOUND_1 + NOT_FOUND_2;
                               //  searchResult will be undefined if name was undefined or otherwise not found among the skiAreas
            contentType      = CONTENT_PLAIN;
            statusCode       = searchResult ? httpStatus.OK : httpStatus.BAD_REQUEST;
            break;
        case DELETE:
            path             = "";  //  This route will not result in a pre-written HTML page being displayed.
            searchTerm       = query(DELETE, originalURL).name;  //  Extract the search term from the query string.
            responseContent  = "The record for " + searchTerm + " . . . ";
            searchResult     = skiAreas.delete(searchTerm);  //  Look up searchTerm among the ski areas.
            responseContent += searchResult ? " has been deleted." : NOT_FOUND_1 + NOT_FOUND_2;
                               //  searchResult will be undefined if name was undefined or otherwise not found among the skiAreas
            contentType      = CONTENT_PLAIN;
            statusCode       = searchResult ? httpStatus.OK : httpStatus.BAD_REQUEST;
            break;
        case ADD:
            path             = "";  //  This route will not result in a pre-written HTML page being displayed.
            let name = query(ADD, originalURL).name;  //  Extract the ski area's name from the query string.
            if (name === undefined) {  //  No ski area name could be found in the query string.
                responseContent = "A name field must be included in the query string.\n" +
                                  NO_NEW + NOT_FOUND_2;
                statusCode      = httpStatus.BAD_REQUEST;
            } else {
                let newSkiArea = skiAreas.add(
                    name,
                    query(ADD, originalURL).region,
                    query(ADD, originalURL).country,
                    query(ADD, originalURL).latitude,
                    query(ADD, originalURL).top,
                    query(ADD, originalURL).base,
                    query(ADD, originalURL).website,
                    query(ADD, originalURL).article
                );
                if (newSkiArea === undefined) {
                    responseContent = "The ski area " + name + " is already in the list, " +
                                      DETAILS +
                                      JSON.stringify(skiAreas.get(name)) + "\n\n" +
                                      NO_NEW;
                    statusCode      = httpStatus.BAD_REQUEST;
                } else {
                    responseContent = "The ski area " + name + " has been added, " +
                                      DETAILS + JSON.stringify(newSkiArea);
                    statusCode      = httpStatus.OK;
                }
            }
            contentType = CONTENT_PLAIN;
            break;
        default:
            path        = "/public/notfound.html";
            contentType = CONTENT_HTML;
            statusCode  = httpStatus.NOT_FOUND;
            break;
    }


    if (responseContent) {  //  then display that content
        sendResponse(statusCode, contentType, responseContent);
    } else {  //  look up and display an html page
        fs.readFile(__dirname + path, function(err, fileContent) {
            //  Note to self:  Watch out.  From here, this function completes asynchronously.
            if (err) {
                contentType      =  CONTENT_PLAIN;
                statusCode       =  httpStatus.INTERNAL_SERVER_ERROR;
                responseContent  =  statusCode + ": Internal Error";
            } else {  //  contentType and statusCode should have already been set by now
                responseContent = fileContent;
            }
            sendResponse(statusCode, contentType, responseContent);
        });
    }
        
}; 


http.createServer(server).listen(process.env.PORT || 3000);
console.log("Server started on localhost:3000.  Press <Ctrl+C> to terminate.");  //  Confirm that the server is up and running.
