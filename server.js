const http = require('http');
const app = require('./app'); // app file include

const globalVariable = require('./nodemon');
const port = process.env.PORT || globalVariable.PORT;

// console.log("port ---->",port);
// const port = process.env.PORT || 3060;

const server = http.createServer(app);
server.listen(port);