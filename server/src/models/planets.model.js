import { parse } from "csv-parse";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let habitablePlanet = [];
function isHabitablePlanet(disposition) {
    return disposition === "CONFIRMED";
}
function idealInsolationFlux(earthFlux) {
    return earthFlux > 0.36 && earthFlux <= 1.11;
}
function isPossibleToHaveSolidSurface(radius) {
    return radius <= 1.6;
}
async function loadPlanetData() {
    try {
        await fs
            .createReadStream(path.join(__dirname, "..", "..", "data", "kepler_data_20220709.csv"))
            .pipe(parse({
            comment: "#",
            columns: true,
        }))
            .on("data", (data) => {
            if (isHabitablePlanet(data["koi_disposition"]) &&
                idealInsolationFlux(data["koi_insol"]) &&
                isPossibleToHaveSolidSurface(data["koi_prad"])) {
                habitablePlanet.push(data);
            }
        })
            .on("error", (err) => {
            throw err;
        })
            .on("end", () => {
            console.log(`${habitablePlanet.length} habitable planets found `);
        });
    }
    catch (error) {
        console.log(error);
    }
}
export { habitablePlanet, loadPlanetData };
