import { Request, Response } from "express";
import { getAllPlanets } from "../../models/planets.model";

async function httpGetAllPlanets(req: Request, res: Response) {
  res.status(200).json(await getAllPlanets());
}

export { httpGetAllPlanets };
