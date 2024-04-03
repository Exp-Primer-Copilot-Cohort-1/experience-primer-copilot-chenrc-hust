// Create web server
// Run using 'node comments.js'
// Visit http://localhost:3000/comments to see the comments

// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  var path = url.parse(request.url).pathname;
  switch (path) {
    case '/':
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write('Hello World');
      response.end();
      break;
    case '/comments':
      switch (request.method) {
        case 'POST':
          var body = '';
          request.on('data', function (data) {
            body += data;
            if (body.length > 1e6) {
              request.connection.destroy();
            }
          });
          request.on('end', function () {
            var POST = qs.parse(body);
            console.log(POST);
            fs.appendFile('comments.txt', POST['name'] + ': ' + POST['comment'] + '\n', function (err) {
              if (err) throw err;
              console.log('Comment saved!');
            });
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end('Comment saved: ' + POST['comment']);
          });
          break;
        default:
          response.writeHead(200, {'Content-Type': 'text/html'});
          fs.readFile('comments.txt', function (err, data) {
            if (err) throw err;
            response.write(data);
            response.end('<form action="/comments" method="post"><input type="text" name="name" placeholder="Name"><br><textarea name="comment" placeholder="Comment"></textarea><br><input type="submit" value="Submit"></form>');
          });
          break;
      }
      break;
    default:
      response.writeHead(404);
      response.write('404 - Page not found');
      response.end();
      break;
  }
});

// Listen on port 3000, IP defaults to