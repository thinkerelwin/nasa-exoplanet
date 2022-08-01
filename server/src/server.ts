import http from "http";

import App from "./app.js";
import { loadPlanetData } from "./models/planets.model.js";

const PORT = process.env.PORT || 8000;
const server = http.createServer(App);

async function startServer() {
  await loadPlanetData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
