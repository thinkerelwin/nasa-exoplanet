import mongoose from "mongoose";

import "dotenv/config";

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDB is connected");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB got error", err);
});

async function connectMongo() {
  if (!MONGO_URL) {
    console.error("MONGO_URL isn't set");
    return;
  }

  await mongoose.connect(MONGO_URL);
}

async function disconnectMongo() {
  await mongoose.disconnect();
}

export { connectMongo, disconnectMongo };
