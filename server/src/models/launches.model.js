const launches = new Map();
let latestFlightNumber = 100;
const defaultCustomers = ["Elwin", "NASA"];
const launch = {
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
function existedLaunchWithId(launchId) {
    return launches.has(launchId);
}
function getAllLaunches() {
    return [...launches.values()];
}
function addNewLaunch(launch) {
    latestFlightNumber++;
    launches.set(latestFlightNumber, Object.assign(Object.assign({}, launch), { success: true, upcoming: true, customers: defaultCustomers, flightNumber: latestFlightNumber }));
}
function abortLaunchById(launchId) {
    const aborted = launches.get(launchId);
    if (!aborted)
        return "can't find launchId";
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}
export { existedLaunchWithId, getAllLaunches, addNewLaunch, abortLaunchById };
