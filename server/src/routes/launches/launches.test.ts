import request from "supertest";
import app from "../../app.js";

describe("Test GET /launches", () => {
  it("It should respond with 200 success", async () => {
    const response = await request(app).get("/launches");

    expect(response.statusCode).toBe(200);
  });
});

describe("Test POST /launch", () => {
  it("It should respond with 200 success", () => {
    // const response = 200;
    // expect(response).toBe(200);
  });

  it("It should catch missing required properties", () => {});

  it("It should catch invalid dates", () => {});
});
