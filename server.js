const express = require('express');
const helmet = require('helmet')
const server = express();
const userRouter = require('./users/userRouter.js')

server.use(express.json())
server.use(logger)
server.use(helmet())
server.use('/api/users', userRouter)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.hostname}`)
  next()
}

module.exports = server;
