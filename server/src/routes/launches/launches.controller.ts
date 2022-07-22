import { Request, Response } from "express";
import { launches } from "../../models/launches.model.js";

function getAllLaunches(req: Request, res: Response) {
  return res.status(200).json([...launches.values()]);
}

export { getAllLaunches };
