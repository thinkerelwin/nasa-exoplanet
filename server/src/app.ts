import express, { Request, Response } from "express";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import bodyParser from "body-parser";

import PlanetsRouter from "./routes/planets/planets.router.js";
import LaunchesRouter from "./routes/launches/launches.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(bodyParser.json());
app.use(morgan("combined"));
// app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/planets", PlanetsRouter);
app.use("/launches", LaunchesRouter);

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

export default app;
