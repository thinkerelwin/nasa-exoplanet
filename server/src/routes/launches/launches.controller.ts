import { Request, Response } from "express";
import {
  getAllLaunches,
  scheduleNewLaunch,
  existedLaunchWithId,
  abortLaunchById,
} from "../../models/launches.model";

import { getPagination } from "../../services/query";

async function httpGetAllLaunches(req: Request, res: Response) {
  const { skip, limit } = getPagination(req.query);
  const launche = await getAllLaunches(skip, limit);
  return res.status(200).json(launche);
}

async function httpAddNewLaunch(req: Request, res: Response) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
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

  await scheduleNewLaunch(launchWithTransformedDate);
  return res.status(201).json(launchWithTransformedDate);
}

async function httpAbortLaunch(req: Request, res: Response) {
  const { page, limit } = req.query;

  const id = req.params.id;

  if (!(await existedLaunchWithId(Number(id)))) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  const aborted = await abortLaunchById(Number(id));

  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  }

  return res.status(200).json({
    ok: true,
  });
}

export { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
