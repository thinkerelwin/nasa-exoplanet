import { Request, Response } from "express";
import {
  getAllLaunches,
  addNewLaunch,
  existedLaunchWithId,
  abortLaunchById,
} from "../../models/launches.model";

function httpGetAllLaunches(req: Request, res: Response) {
  return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req: Request, res: Response) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    console.log("launch", launch);
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }
  const launchWithTransformedDate = {
    ...launch,
    launchDate: new Date(launch.launchDate),
  };

  if (isNaN(launchWithTransformedDate.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }

  addNewLaunch(launchWithTransformedDate);
  return res.status(201).json(launchWithTransformedDate);
}

function httpAbortLaunch(req: Request, res: Response) {
  const id = req.params.id;

  if (!existedLaunchWithId(Number(id))) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  const aborted = abortLaunchById(Number(id));

  return res.status(200).json({
    aborted,
  });
}

export { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
