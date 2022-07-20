import { habitablePlanet } from "../../models/planets.model.js";
function getAllPlanets(req, res) {
    res.status(200).json(habitablePlanet);
}
export { getAllPlanets };
