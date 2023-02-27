import express, { Request, Response } from "express";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";

import api from "./routes/v1/api";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(morgan("combined"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/v1", api);

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

export default app;
