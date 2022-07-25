import { Request, Response } from "express";
import { getAllLaunches } from "../../models/launches.model.js";

function httpGetAllLaunches(req: Request, res: Response) {
  return res.status(200).json(getAllLaunches());
}

export { httpGetAllLaunches };
