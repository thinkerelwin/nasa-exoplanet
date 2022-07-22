import { Request, Response } from "express";
import { habitablePlanet } from "../../models/planets.model.js";

function getAllPlanets(req: Request, res: Response) {
  res.status(200).json(habitablePlanet);
}

export { getAllPlanets };
