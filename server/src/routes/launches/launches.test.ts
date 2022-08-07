import { jest } from "@jest/globals";
import request from "supertest";

import app from "../../app";
import { connectMongo, disconnectMongo } from "../../services/mongo";

const mockLaunchData = {
  mission: "D Amplifier",
  rocket: "NAD C328",
  target: "Kepler-186 f",
  launchDate: "February 7, 2025",
};

describe("Launches API", () => {
  beforeAll(async () => {
    await connectMongo();
  });
  afterAll(async () => {
    await disconnectMongo();
  });

  describe("Test GET /launches", () => {
    it("It should respond with 200 success", async () => {
      await request(app)
        .get("/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test POST /launch", () => {
    it("It should respond with 200 success", async () => {
      const response = await request(app)
        .post("/launches")
        .send(mockLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const { launchDate, ...mockLaunchDataWithoutDate } = mockLaunchData;

      const requestDate = new Date(mockLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(requestDate).toBe(responseDate);
      expect(response.body).toMatchObject(mockLaunchDataWithoutDate);
    });

    it("It should catch missing required properties", async () => {
      const { launchDate, ...mockLaunchDataWithoutDate } = mockLaunchData;
      const response = await request(app)
        .post("/launches")
        .send(mockLaunchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });

    it("It should catch invalid dates", async () => {
      const invalidLaunchDate = "not valid";
      const response = await request(app)
        .post("/launches")
        .send({ ...mockLaunchData, launchDate: invalidLaunchDate })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
