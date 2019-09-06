const http = require('http');
const app = require('./app'); // app file include
<<<<<<< Updated upstream
const globalVariable = require('./nodemon');
const port = process.env.PORT || globalVariable.PORT;
=======
const port = process.env.PORT || 3060;
// const port = process.env.PORT || 5006;
>>>>>>> Stashed changes
const server = http.createServer(app);
server.listen(port);