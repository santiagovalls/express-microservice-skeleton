import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../app.js";
import config from "../config/index.js";

describe("Mock and Health Check Endpoints", () => {
  let adminToken;
  let userToken;

  // User data for testing
  const adminUser = {
    username: "admin",
    uuid: "550e8400-e29b-41d4-a716-446655440000",
    role: "admin",
  };

  const regularUser = {
    username: "user",
    uuid: "550e8400-e29b-41d4-a716-446655440001",
    role: "user",
  };

  // Generate valid tokens before tests
  beforeAll(() => {
    adminToken = jwt.sign(adminUser, config.jwtSecret, {
      expiresIn: config.jwtExpiration,
    });

    userToken = jwt.sign(regularUser, config.jwtSecret, {
      expiresIn: config.jwtExpiration,
    });
  });

  // Test health check endpoint
  test("should return 200 and status ok for health check", async () => {
    const res = await request(app).get("/health-check");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "ok");
    expect(res.body).toHaveProperty("timestamp");
  });

  // Test mock endpoint with admin token
  test("should return mock data with admin token and include admin user info", async () => {
    const res = await request(app)
      .get("/mock")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("mock", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("username", "admin");
    expect(res.body.user).toHaveProperty("uuid", adminUser.uuid);
    expect(res.body.user).toHaveProperty("role", "admin");
  });

  // Test mock endpoint with user token
  test("should return mock data with user token and include user info", async () => {
    const res = await request(app)
      .get("/mock")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("mock", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("username", "user");
    expect(res.body.user).toHaveProperty("uuid", regularUser.uuid);
    expect(res.body.user).toHaveProperty("role", "user");
  });

  // Test mock endpoint without token
  test("should return 401 without token", async () => {
    const res = await request(app).get("/mock");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Token not provided or invalid");
  });

  // Test mock endpoint with invalid token
  test("should return 401 with invalid token", async () => {
    const res = await request(app)
      .get("/mock")
      .set("Authorization", "Bearer invalid_token");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Token not provided or invalid");
  });

  // Test mock endpoint with malformed authorization header
  test("should return 401 with malformed authorization header", async () => {
    const res = await request(app)
      .get("/mock")
      .set("Authorization", "InvalidFormat");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Token not provided or invalid");
  });

  // Test non-existent endpoint
  test("should return 404 for non-existent endpoint", async () => {
    const res = await request(app).get("/non-existent-endpoint");

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("error", "Route not found");
    expect(res.body).toHaveProperty("path", "/non-existent-endpoint");
    expect(res.body).toHaveProperty("method", "GET");
  });
});
