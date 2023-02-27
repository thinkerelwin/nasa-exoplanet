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
  launchDate: string;
  target?: string;
  customers: string[];
  upcoming: boolean;
  success: boolean;
}

interface Payload {
  customers: string[];
}

interface LaunchDoc {
  flight_number: number;
  name: string;
  rocket: {
    name: string;
    id: string;
  };
  date_local: string;
  upcoming: boolean;
  success: boolean;
  payloads: [
    {
      customers: string[];
      id: string;
    }
  ];
}

interface LaunchFilter {
  flightNumber: number;
  rocket?: string;
  mission?: string;
  // and more
}

async function populateLaunches() {
  console.log("Downloading launch data...");

  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
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

  if (response.status !== 200) {
    console.log("get Problem when downloading launch data");
    throw new Error("Launch data download failed");
  }

  const launchDocs: LaunchDoc[] = response.data.docs;

  launchDocs.forEach(async (launchDoc) => {
    const customers = launchDoc.payloads.flatMap(
      (payload: Payload) => payload["customers"]
    );

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };

    await saveLaunch(launch);
  });
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("Launch data already loaded");
    return;
  }

  await populateLaunches();
}

async function findLaunch(filter: LaunchFilter) {
  return await launches.findOne(filter);
}

async function existedLaunchWithId(launchId: number) {
  return await findLaunch({ flightNumber: launchId });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launches.findOne({}).sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function getAllLaunches(skip: number, limit: number) {
  return await launches
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function saveLaunch(launch: Launch) {
  await launches.findOneAndUpdate(
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
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found");
  }

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
  loadLaunchData,
  existedLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
};
