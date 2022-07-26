const launches = new Map();

let latestFlightNumber = 100;
const defaultCustomers = ["Elwin", "NASA"];

interface Launch {
  flightNumber: number;
  mission: string;
  rocket: string;
  launchDate: Date;
  destination: string;
  customer: string[];
  upcoming: boolean;
  success: boolean;
}

const launch: Launch = {
  flightNumber: latestFlightNumber,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  destination: "Kepler-442 b",
  customer: defaultCustomers,
  upcoming: true,
  success: true,
};

launches.set(latestFlightNumber, launch);

function getAllLaunches() {
  return [...launches.values()];
}

function addNewLaunch(launch: Launch) {
  latestFlightNumber++;
  launches.set(latestFlightNumber, {
    ...launch,
    flightNumber: latestFlightNumber,
  });
}

export { getAllLaunches, addNewLaunch };
