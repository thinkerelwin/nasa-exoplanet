var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function loadPlanetData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs
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
    });
}
function getAllPlanets() {
    return habitablePlanet;
}
export { loadPlanetData, getAllPlanets };
