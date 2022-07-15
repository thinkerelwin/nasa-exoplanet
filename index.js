import fs from "fs";
let results = [];
fs.createReadStream("./kepler_data_20220709.csv")
    .on("data", (data) => {
    results.push(data);
})
    .on("error", (err) => {
    console.log(err);
})
    .on("end", () => {
    console.log("result: ", results);
});
