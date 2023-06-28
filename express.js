const express = require('express')
const morgan = require('morgan')
const path = require('path')
const app = express()
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");

const publicDir = path.join(__dirname, 'docs')

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(publicDir);
app.use(connectLivereload());

app.use(express.static(publicDir))
app.use(morgan('dev'))

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000')
})
