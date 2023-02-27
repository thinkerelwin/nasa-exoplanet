import axios from "axios";

import launches from "./launches.mongo";
import planets from "./launches.mongo";
// const launches: Map<number, Launch> = new Map();

const DEFAULT_FLIGHT_NUMBER = 1;
const defaultCustomers = ["Elwin", "NASA"];
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

interface Launch {
  flightNumber: number;
  mission: string;
  rocket: string;
  launchDate: Date;
  target: string;
  customers: string[];
  upcoming: boolean;
  success: boolean;
}

const launch: Launch = {
  flightNumber: DEFAULT_FLIGHT_NUMBER, // flight_number
  mission: "Kepler Exploration X", // name
  rocket: "Explorer IS1", // rocket.name
  launchDate: new Date("December 27, 2030"), // data_local
  target: "Kepler-442 b", // not applicable
  customers: defaultCustomers, // payload.customers for each payload
  upcoming: true, // upcoming
  success: true, // success
};

saveLaunch(launch);

async function loadLaunchesData() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });
}

async function existedLaunchWithId(launchId: number) {
  return await launches.findOne({ flightNumber: launchId });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launches.findOne({}).sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  return await launches.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch: Launch) {
  return await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch(launch: Launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = {
    ...launch,
    success: true,
    upcoming: true,
    customers: defaultCustomers,
    flightNumber: newFlightNumber,
  };
  await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId: number) {
  const aborted = await launches.updateOne(
    { flightNumber: launchId },
    {
      upcoming: false,
      success: false,
    }
  );
  console.log("aborted", aborted, launchId);
  return aborted.modifiedCount === 1;
}

export {
  loadLaunchesData,
  existedLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
};
