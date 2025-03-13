import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../app.js";
import config from "../config/index.js";

describe("Role-Based Authorization Tests", () => {
  // User tokens for testing
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

  // Test admin access to admin-mock endpoint
  test("should allow admin to access /admin-mock", async () => {
    const res = await request(app)
      .get("/admin-mock")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("adminData");
    expect(res.body.user).toHaveProperty("role", "admin");
  });

  // Test user access to admin-mock endpoint (should be denied)
  test("should deny user access to /admin-mock", async () => {
    const res = await request(app)
      .get("/admin-mock")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty("error", "Access denied");
  });

  // Test user access to user-mock endpoint
  test("should allow user to access /user-mock", async () => {
    const res = await request(app)
      .get("/user-mock")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("userData");
    expect(res.body.user).toHaveProperty("role", "user");
  });

  // Test admin access to user-mock endpoint (should be allowed)
  test("should allow admin to access /user-mock", async () => {
    const res = await request(app)
      .get("/user-mock")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("userData");
    expect(res.body.user).toHaveProperty("role", "admin");
  });

  // Test access without authentication
  test("should deny access to /admin-mock without authentication", async () => {
    const res = await request(app).get("/admin-mock");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Token not provided or invalid");
  });

  // Test access without authentication
  test("should deny access to /user-mock without authentication", async () => {
    const res = await request(app).get("/user-mock");

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Token not provided or invalid");
  });
});
