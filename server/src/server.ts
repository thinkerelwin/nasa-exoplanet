import http from "http";
import mongoose from "mongoose";

import App from "./app";
import { loadPlanetData } from "./models/planets.model";
import "dotenv/config";

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 8000;
const server = http.createServer(App);

mongoose.connection.once("open", () => {
  console.log("MongoDB is connected");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB got error", err);
});

async function startServer() {
  if (!MONGO_URL) {
    console.error("MONGO_URL isn't set");
    return;
  }

  await mongoose.connect(MONGO_URL);
  await loadPlanetData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

startServer();
