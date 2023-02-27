import http from "http";

import App from "./app";
import { loadPlanetData } from "./models/planets.model";
import { loadLaunchesData } from "./models/launches.model";
import "dotenv/config";
import { connectMongo } from "./services/mongo";

const PORT = process.env.PORT || 8000;
const server = http.createServer(App);

async function startServer() {
  await connectMongo();
  await loadPlanetData();
  await loadLaunchesData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
