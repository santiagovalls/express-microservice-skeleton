import request from "supertest";
import app from "../app.js";

describe("Authentication Endpoints", () => {
  // Test successful login for admin
  test("should login admin with valid credentials and return token", async () => {
    const res = await request(app).post("/login").send({
      username: "admin",
      password: "1234",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  // Test successful login for regular user
  test("should login user with valid credentials and return token", async () => {
    const res = await request(app).post("/login").send({
      username: "user",
      password: "1234",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  // Test login with incorrect username
  test("should return 401 with incorrect username", async () => {
    const res = await request(app).post("/login").send({
      username: "wrong_user",
      password: "1234",
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Invalid credentials");
  });

  // Test login with incorrect password
  test("should return 401 with incorrect password", async () => {
    const res = await request(app).post("/login").send({
      username: "admin",
      password: "wrong_password",
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Invalid credentials");
  });

  // Test login without credentials
  test("should return 400 without credentials", async () => {
    const res = await request(app).post("/login").send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "error",
      "Username and password are required"
    );
  });

  // Test login with null values
  test("should return 400 with null values", async () => {
    const res = await request(app).post("/login").send({
      username: null,
      password: null,
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "error",
      "Username and password are required"
    );
  });

  // Test login with unexpected object format
  test("should handle unexpected object format", async () => {
    const res = await request(app).post("/login").send({
      user: "admin",
      pass: "1234",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "error",
      "Username and password are required"
    );
  });
});
