const request = require("supertest");
const app = require("./main");

describe("Testing endpoints", () => {
  it("Get users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  it("Get single user", async () => {
    const res = await request(app).get("/api/users/1");
    expect(res.statusCode).toEqual(200);
  });
});

describe("Test login route", () => {
  it("Logs in user", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "admin@example.com",
      password: "password",
    });
    expect(res.statusCode).toEqual(200);
  });
});
