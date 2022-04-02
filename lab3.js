//exercice1:
var https = require("https");
var fs = require("fs");
var options = {
hostname: "en.wikipedia.org",
port: 443,
path: "/wiki/George_Washington",
method: "GET"
};
var req = https.request(options, function(res) {
var responseBody = "";
console.log("Response from server started.");
console.log(`Server Status: ${res.statusCode} `);
console.log("Response Headers: %j", res.headers);
res.setEncoding("UTF-8");
res.once("data", function(chunk) {
console.log(chunk);
});
res.on("data", function(chunk) {
console.log(`--chunk-- ${chunk.length}`);
responseBody += chunk;
});
res.on("end", function() {
fs.writeFile("george-washington.html", responseBody, function(err)
{
if (err) {
throw err;
}
console.log("File Downloaded");
});
});
});
req.on("error", function(err) {
console.log(`problem with request: ${err.message}`);
});
req.end();

//exercice2:
var http = require("http");
var server = http.createServer(function(req, res) {
res.writeHead(200, {"Content-Type": "text/html"});
res.end(`
<!DOCTYPE html>
<html>
<head>
<title>HTML Response</title>
</head>
<body>
<h1>Serving HTML Text</h1>
<p>${req.url}</p>
<p>${req.method}</p>
</body>
</html>
`);
});
server.listen(3000);
console.log("Server listening on port 3000");

//exercice3:
var http = require("http");
var fs = require("fs");
var path = require("path");
http.createServer(function(req, res) {
console.log(`${req.method} request for ${req.url}`);
if (req.url === "/") {
fs.readFile("./public/index.html", "UTF-8", function(err, html) {
res.writeHead(200, {"Content-Type": "text/html"});
res.end(html);
});
} else if (req.url.match(/.css$/)) {
var cssPath = path.join(__dirname, 'public', req.url);
var fileStream = fs.createReadStream(cssPath, "UTF-8");
res.writeHead(200, {"Content-Type": "text/css"});
fileStream.pipe(res);
} else if (req.url.match(/.jpg$/)) {
var imgPath = path.join(__dirname, 'public', req.url);
var imgStream = fs.createReadStream(imgPath);
res.writeHead(200, {"Content-Type": "image/jpeg"});
imgStream.pipe(res);
} else {
res.writeHead(404, {"Content-Type": "text/plain"});
res.end("404 File Not Found");
}
}).listen(3000);
console.log("File server running on port 3000");

//exercice4:
var http = require("http");
var data = require("./data/inventory");
http.createServer(function(req, res) {
if (req.url === "/") {
res.writeHead(200, {"Content-Type": "text/json"});
res.end(JSON.stringify(data));
} else if (req.url === "/instock") {
listInStock(res);
} else if (req.url === "/onorder") {
listOnBackOrder(res);
} else {
res.writeHead(404, {"Content-Type": "text/plain"});
res.end("Whoops... Data not found");
}
}).listen(3000);
console.log("Server listening on port 3000");
function listInStock(res) {
var inStock = data.filter(function(item) {
return item.avail === "In stock";
});
res.end(JSON.stringify(inStock));
}
function listOnBackOrder(res) {
var onOrder = data.filter(function(item) {
return item.avail === "On back order";
});
res.end(JSON.stringify(onOrder));
}

//exercice5:
var http = require("http");
var fs = require("fs");
http.createServer(function(req, res) {
if (req.method === "GET") {
res.writeHead(200, {"Content-Type": "text/html"});
fs.createReadStream("./public/form.html", "UTF-8").pipe(res);
} else if (req.method === "POST") {
var body = "";
req.on("data", function(chunk) {
body += chunk;
});
req.on("end", function() {
res.writeHead(200, {"Content-Type": "text/html"});
res.end(`
<!DOCTYPE html>
<html>
<head>
<title>Form Results</title>
</head>
<body>
<h1>Your Form Results</h1>
<p>${body}</p>
</body>
</html>
`);
});
}
}).listen(3000);
console.log("Form server listening on port 3000");
