const launches: Map<number, Launch> = new Map();

let latestFlightNumber = 100;
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
  flightNumber: latestFlightNumber,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: defaultCustomers,
  upcoming: true,
  success: true,
};

launches.set(latestFlightNumber, launch);

function existedLaunchWithId(launchId: number) {
  return launches.has(launchId);
}

function getAllLaunches() {
  return [...launches.values()];
}

function addNewLaunch(launch: Launch) {
  latestFlightNumber++;
  launches.set(latestFlightNumber, {
    ...launch,
    success: true,
    upcoming: true,
    customers: defaultCustomers,
    flightNumber: latestFlightNumber,
  });
}

function abortLaunchById(launchId: number) {
  const aborted = launches.get(launchId);

  if (!aborted) return "can't find launchId";

  aborted.upcoming = false;
  aborted.success = false;

  return aborted;
}

export { getAllLaunches, addNewLaunch, existedLaunchWithId, abortLaunchById };
