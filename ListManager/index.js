/*  Week 1 - Node.js up and running
 *  Peter Caliandro
 *  ITC 230, Spring 2018
 */

var fs   = require("fs");
var http = require("http");
http.createServer(server).listen(process.env.PORT || 3000);
console.log("Server started on localhost:3000.  Press <Ctrl+C> to terminate.");  //  Confirm that the server is up and running.

/*  This function is a very simple Node.js web server.
 *  It serves just three web pages: home (index), about, and (404) notfound.
 *  All of these are static web pages.
 */
function server(request, response) {
    var path = request.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase();
    var contentType;
    var statusCode;
    
    switch(path) {  //  Depending on the original value for path, reset the path, and set the contentType and the statusCode.
        case "":
        case "/home.html":
        case "/home":
        case "/index.html":
        case "/index":
            path        = "/public/home.html";
            contentType = "text/html";
            statusCode  = 200;
            break;
        case "/about.html":
        case "/about":
            path        = "/public/about.html";
            contentType = "text/html";
            statusCode  = 200;
            break;
        default:
            path        = "/public/notfound.html";
            contentType = "text/html";
            statusCode  = 404;
            break;
    }

    fs.readFile(__dirname + path, function(err, content) {
        if (err) {
            contentType =  "text/plain";
            statusCode  =  500;
            content     =  statusCode + ": Internal Error";
        }
        response.writeHead(statusCode, { "Content-Type" : contentType });
        response.end(content);
    });
} 
