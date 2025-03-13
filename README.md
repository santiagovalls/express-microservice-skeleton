# Express Microservice with JWT and Database Integration

This project implements a microservice using Express.js with JWT authentication, PostgreSQL database integration via Prisma ORM, and configuration for multiple environments.

## Features

- JWT authentication with database-backed user management
- PostgreSQL database for all environments (development, test, QA, production)
- Prisma ORM for database operations
- Protected endpoint for mock data with user information
- Health check endpoint
- Configuration for multiple environments (development, QA, production)
- Rotating log system
- Comprehensive testing with Jest

## Requirements

- Node.js (version 14 or higher)
- npm (version 6 or higher)
- Docker and Docker Compose (for PostgreSQL)

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Database Setup

The project uses PostgreSQL for all environments to ensure consistency and avoid compatibility issues.

### Setting up PostgreSQL with Docker

Start the PostgreSQL container which will create databases for all environments:

```bash
# Start PostgreSQL container
npm run docker:up

# Stop PostgreSQL container
npm run docker:down
```

### Database Migrations

To set up the database schema:

```bash
# Setup database for current NODE_ENV
npm run db:setup

# Setup database for specific environments
npm run db:setup:dev   # Development
npm run db:setup:test  # Test
npm run db:setup:qa    # QA
npm run db:setup:prod  # Production
```

### Prisma Studio

To explore and manage your database with a visual interface:

```bash
npm run db:studio
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
- `DATABASE_URL` - PostgreSQL connection URL

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

Default seeded users (in development/test):
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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "admin",
    "name": "Administrator",
    "role": "admin"
  }
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
    "id": "550e8400-e29b-41d4-a716-446655440000",
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
    "id": "550e8400-e29b-41d4-a716-446655440000",
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
    "id": "550e8400-e29b-41d4-a716-446655440001",
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
├── prisma/
│   └── schema.prisma       # Prisma schema definition
├── scripts/
│   ├── clean-logs.js       # Script to clean log files
│   ├── init-db.sql         # SQL script to initialize databases
│   └── setup-database.js   # Script to set up the database
├── src/
│   ├── config/
│   │   ├── database.js     # Database configuration
│   │   ├── index.js        # Main configuration
│   │   └── permissions.json # Role permissions
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
│   ├── services/
│   │   └── userService.js  # User database operations
│   ├── tests/
│   │   ├── auth.test.js
│   │   └── mock.test.js
│   ├── utils/
│   │   └── logger.js
│   ├── app.js
│   └── server.js
├── .env.development        # Development environment variables
├── .env.production         # Production environment variables
├── .env.qa                 # QA environment variables
├── .env.test               # Test environment variables
├── docker-compose.yml      # Docker Compose for PostgreSQL
├── package.json
└── README.md
```

## Database Schema

### User

| Field      | Type      | Description                    |
|------------|-----------|--------------------------------|
| id         | UUID      | Primary key                    |
| username   | String    | Unique username (max 255 chars)|
| password   | String    | Hashed password                |
| name       | String    | User's name (max 255 chars)    |
| role       | String    | User's role (default: "user")  |
| last_login | DateTime? | Last login timestamp           |
| created_at | DateTime  | Creation timestamp             |
| updated_at | DateTime  | Last update timestamp          | 