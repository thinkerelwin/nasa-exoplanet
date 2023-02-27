import express from "express";

import PlanetsRouter from "../planets/planets.router";
import LaunchesRouter from "../launches/launches.router";

const api = express.Router();

api.use("/planets", PlanetsRouter);
api.use("/launches", LaunchesRouter);

export default api;
