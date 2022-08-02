/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
import type { InitialOptionsTsJest } from "ts-jest";
import { defaults as tsjPreset } from "ts-jest/presets";

const config: InitialOptionsTsJest = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  verbose: true,
  transform: {
    // ...tsjPreset.transform,
  },
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
export default config;
