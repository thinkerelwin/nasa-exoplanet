import express from "express";

import PlanetsRouter from "./routes/planets/planets.router.js";

const app = express();

app.use(express.json());
app.use(PlanetsRouter);

export default app;
