import { parse } from "csv-parse";
import fs from "fs";
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
fs.createReadStream("./src/data/kepler_data_20220709.csv")
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
    console.log(err);
})
    .on("end", () => {
    console.log(habitablePlanet.map((planet) => planet["kepler_name"]));
    console.log(`${habitablePlanet.length} habitable planets found `);
});
export { habitablePlanet };
