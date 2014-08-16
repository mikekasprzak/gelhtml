// Requires connect and serve-static installed locally (node_modules). Install as follows.
//   sudo npm install connect
//   sudo npm install serve-static

// Start server from this directory with: 
//   node .
// (i.e. run index.js in nodejs speak)
var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(8000); // http://localhost:PORT
