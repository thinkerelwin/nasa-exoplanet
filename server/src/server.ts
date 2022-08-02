import http from "http";

import App from "./app";
import { loadPlanetData } from "./models/planets.model";

const PORT = process.env.PORT || 8000;
const server = http.createServer(App);

async function startServer() {
  await loadPlanetData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
