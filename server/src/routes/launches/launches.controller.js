import { getAllLaunches, addNewLaunch } from "../../models/launches.model.js";
function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches());
}
function httpAddNewLaunch(req, res) {
    const launch = req.body;
    if (!launch.mission ||
        !launch.rocket ||
        !launch.launchDate ||
        !launch.target) {
        console.log("launch", launch);
        return res.status(400).json({
            error: "Missing required launch property",
        });
    }
    const launchWithTransformedDate = Object.assign(Object.assign({}, launch), { launchDate: new Date(launch.launchDate) });
    if (isNaN(launchWithTransformedDate.launchDate)) {
        return res.status(400).json({
            error: "Invalid launch date",
        });
    }
    addNewLaunch(launchWithTransformedDate);
    return res.status(201).json(launchWithTransformedDate);
}
export { httpGetAllLaunches, httpAddNewLaunch };
