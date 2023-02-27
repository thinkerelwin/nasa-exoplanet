import https from "https";
import fs from "fs";
import "dotenv/config";

import App from "./app";
import { loadPlanetData } from "./models/planets.model";
import { loadLaunchData } from "./models/launches.model";
import { connectMongo } from "./services/mongo";

const PORT = process.env.PORT || 8000;
const server = https.createServer(
  {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
  },
  App
);

async function startServer() {
  await connectMongo();
  await loadPlanetData();
  await loadLaunchData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
