const launches = new Map();
let latestFlightNumber = 100;
const defaultCustomers = ["Elwin", "NASA"];
const launch = {
    flightNumber: latestFlightNumber,
    mission: "Kepler Exploration X",
    rocket: "Explorer IS1",
    launchDate: new Date("December 27, 2030"),
    target: "Kepler-442 b",
    customer: defaultCustomers,
    upcoming: true,
    success: true,
};
launches.set(latestFlightNumber, launch);
function getAllLaunches() {
    return [...launches.values()];
}
function addNewLaunch(launch) {
    latestFlightNumber++;
    launches.set(latestFlightNumber, Object.assign(Object.assign({}, launch), { success: true, upcoming: true, customers: defaultCustomers, flightNumber: latestFlightNumber }));
}
export { getAllLaunches, addNewLaunch };
