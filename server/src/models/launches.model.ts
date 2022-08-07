import launches from "./launches.mongo";
import planets from "./launches.mongo";
// const launches: Map<number, Launch> = new Map();

const DEFAULT_FLIGHT_NUMBER = 1;
const defaultCustomers = ["Elwin", "NASA"];

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
  flightNumber: DEFAULT_FLIGHT_NUMBER,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: defaultCustomers,
  upcoming: true,
  success: true,
};

saveLaunch(launch);

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
  existedLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
};
