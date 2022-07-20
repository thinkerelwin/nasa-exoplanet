import http from "http";

import App from "./app.js";

const PORT = process.env.PORT || 8000;
const server = http.createServer(App);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
