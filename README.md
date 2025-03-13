# Express Microservice with JWT

This project implements a microservice using Express.js with JWT authentication and configuration for multiple environments.

## Features

- JWT authentication with multiple user support
- Protected endpoint for mock data with user information
- Health check endpoint
- Configuration for multiple environments (development, QA, production)
- Rotating log system
- Comprehensive testing with Jest

## Requirements

- Node.js (version 14 or higher)
- npm (version 6 or higher)

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Configuration

The project uses specific `.env` files for each environment:

- `.env.development` - Development configuration
- `.env.qa` - QA configuration
- `.env.production` - Production configuration
- `.env.test` - Test configuration

Each file must contain the following variables (all are mandatory):

- `PORT` - Port on which the server will run
- `JWT_SECRET` - Secret key for signing JWT tokens
- `JWT_EXPIRATION` - Expiration time for JWT tokens (e.g. "2h", "1d")
- `LOG_LEVEL` - Log level (debug, info, warn, error)
- `NODE_ENV` - Execution environment (development, qa, production, test)

**Important note**: The application will not start if any of these parameters are missing in the corresponding configuration file. An error message will be displayed detailing the missing parameters.

## Execution

### Development

```bash
npm run dev
```

### QA

```bash
npm run qa
```

### Production

```bash
npm run prod
```

### Start with standard script

```bash
npm start
```

### Clean logs

```bash
npm run clean-logs
```

## Endpoints

### Authentication

**POST /login**

Authenticates the user and returns a JWT token.

Available users:
- Username: `admin`, Password: `1234`, Role: `admin`
- Username: `user`, Password: `1234`, Role: `user`

Request example:
```bash
curl -X POST http://localhost:3001/login \
-H "Content-Type: application/json" \
-d '{"username": "admin", "password": "1234"}'
```

Successful response (HTTP 200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Token Management**

This microservice is designed to work with an API Manager that handles token renewal. When a token expires, a new login request must be made to obtain a fresh token. There is no dedicated token refresh endpoint as token management is handled at the API Manager level.

### Mock Data

**GET /mock**

Returns mock data from a JSON file along with the authenticated user's information. Requires authentication.

Request example:
```bash
curl -X GET http://localhost:3001/mock \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Successful response (HTTP 200):
```json
{
  "mock": true,
  "data": {
    "id": 1,
    "name": "Mock Data",
    "timestamp": "2025-03-12T23:41:53Z"
  },
  "user": {
    "username": "admin",
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "role": "admin"
  }
}
```

### Role-Based Access Control

The microservice implements role-based access control (RBAC) for certain endpoints. Permissions are defined in a configuration file (`src/config/permissions.json`) that maps roles to allowed endpoints.

Available roles:
- `admin`: Has access to all endpoints
- `user`: Has limited access to specific endpoints

**GET /admin-mock**

Returns admin-specific mock data. Requires authentication and admin role.

Request example:
```bash
curl -X GET http://localhost:3001/admin-mock \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Successful response (HTTP 200):
```json
{
  "adminData": true,
  "message": "This endpoint is only accessible to admins",
  "user": {
    "username": "admin",
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "role": "admin"
  }
}
```

Unauthorized response (HTTP 403):
```json
{
  "error": "Access denied"
}
```

**GET /user-mock**

Returns user-specific mock data. Requires authentication and user role (admin role also has access).

Request example:
```bash
curl -X GET http://localhost:3001/user-mock \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Successful response (HTTP 200):
```json
{
  "userData": true,
  "message": "This endpoint is accessible to users and admins",
  "user": {
    "username": "user",
    "uuid": "550e8400-e29b-41d4-a716-446655440001",
    "role": "user"
  }
}
```

### Health Check

**GET /health-check**

Checks if the service is working correctly.

Request example:
```bash
curl -X GET http://localhost:3001/health-check
```

Successful response (HTTP 200):
```json
{
  "status": "ok",
  "timestamp": "2025-03-12T23:41:53Z"
}
```

## Tests

To run the tests:

```bash
npm test
```

The test suite includes:
- Authentication tests
- Protected endpoint access tests
- Role-based authorization tests
- Health check tests

## Project Structure

```
├── src/
│   ├── config/
│   │   ├── index.js
│   │   └── permissions.json
│   ├── controllers/
│   │   ├── authController.js
│   │   └── mockController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── authorizationMiddleware.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── mockRoutes.js
│   ├── tests/
│   │   ├── auth.test.js
│   │   ├── authorization.test.js
│   │   └── mock.test.js
│   ├── utils/
│   │   └── logger.js
│   ├── app.js
│   └── server.js
├── logs/
│   └── winston/
├── scripts/
│   └── clean-logs.js
├── .env.development
├── .env.qa
├── .env.production
├── .env.test
├── jest.config.js
├── mock-response.json
├── package.json
└── README.md
``` 