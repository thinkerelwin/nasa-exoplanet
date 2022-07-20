import { parse } from "csv-parse";
import fs from "fs";

interface Planet {
  koi_disposition: string;
  koi_insol: number;
  koi_prad: number;
  kepler_name: string;
}

let habitablePlanet: Planet[] = [];

function isHabitablePlanet(disposition: string) {
  return disposition === "CONFIRMED";
}

function idealInsolationFlux(earthFlux: number) {
  return earthFlux > 0.36 && earthFlux <= 1.11;
}

function isPossibleToHaveSolidSurface(radius: number) {
  return radius <= 1.6;
}

fs.createReadStream("./kepler_data_20220709.csv")
  .pipe(
    parse({
      comment: "#",
      columns: true,
    })
  )
  .on("data", (data: Planet) => {
    if (
      isHabitablePlanet(data["koi_disposition"]) &&
      idealInsolationFlux(data["koi_insol"]) &&
      isPossibleToHaveSolidSurface(data["koi_prad"])
    ) {
      habitablePlanet.push(data);
    }
  })
  .on("error", (err: Error) => {
    console.log(err);
  })
  .on("end", () => {
    console.log(habitablePlanet.map((planet) => planet["kepler_name"]));
    console.log(`${habitablePlanet.length} habitable planets found `);
  });
