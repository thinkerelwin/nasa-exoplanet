const http = require("http");

const App = require("./app");

const PORT = process.env.PORT || 8000;
const server = http.createServer(App);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
