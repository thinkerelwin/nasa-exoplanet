import { parse } from "csv-parse";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
interface Planet {
  koi_disposition: string;
  koi_insol: number;
  koi_prad: number;
  kepler_name: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

async function loadPlanetData() {
  try {
    await fs
      .createReadStream(
        path.join(__dirname, "..", "..", "data", "kepler_data_20220709.csv")
      )
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
        throw err;
      })
      .on("end", () => {
        console.log(`${habitablePlanet.length} habitable planets found `);
      });
  } catch (error) {
    console.log(error);
  }
}

export { habitablePlanet, loadPlanetData };
