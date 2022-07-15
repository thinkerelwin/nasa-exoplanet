import { parse } from "csv-parse";
import fs from "fs";

let results: string[] = [];

fs.createReadStream("./kepler_data_20220709.csv")
  .on("data", (data: string) => {
    results.push(data);
  })
  .on("error", (err) => {
    console.log(err);
  })
  .on("end", () => {
    console.log("result: ", results);
  });
