var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import request from "supertest";
import app from "../../app.js";
describe("Test GET /launches", () => {
    it("It should respond with 200 success", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app).get("/launches");
        expect(response.statusCode).toBe(200);
    }));
});
describe("Test POST /launch", () => {
    it("It should respond with 200 success", () => {
        // const response = 200;
        // expect(response).toBe(200);
    });
    it("It should catch missing required properties", () => { });
    it("It should catch invalid dates", () => { });
});
