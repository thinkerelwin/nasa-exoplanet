import { parse } from "csv-parse";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import planets from "./planets.mongo";

interface Planet {
  kepler_name: string;
  // below areoriginal names from NASA csv data
  koi_disposition: string;
  koi_insol: number;
  koi_prad: number;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
      .on("data", async (data: Planet) => {
        if (
          isHabitablePlanet(data["koi_disposition"]) &&
          idealInsolationFlux(data["koi_insol"]) &&
          isPossibleToHaveSolidSurface(data["koi_prad"])
        ) {
          await savePlanet(data);
        }
      })
      .on("error", (err: Error) => {
        throw err;
      })
      .on("end", async () => {
        const planetsFound = (await getAllPlanets()).length;
        console.log(`${planetsFound} habitable planets found `);
      });
  } catch (error) {
    console.log(error);
  }
}

async function getAllPlanets() {
  return await planets.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

async function savePlanet(planet: Planet) {
  try {
    return await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (error) {
    console.error(`Failed to save the planet ${error}`);
  }
}

export { loadPlanetData, getAllPlanets };
