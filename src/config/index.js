import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../../");

// Set default NODE_ENV if not provided
process.env.NODE_ENV = process.env.NODE_ENV
  ? process.env.NODE_ENV.trim()
  : "development";

// Load environment variables from the appropriate .env file
const envFile = `.env.${process.env.NODE_ENV}`;
const envPath = path.resolve(rootDir, envFile);

// Check if the env file exists
if (!fs.existsSync(envPath)) {
  console.error(`ERROR: Environment file ${envFile} not found at ${envPath}`);
  process.exit(1);
}

// Load environment variables
dotenv.config({ path: envPath });

// Required configuration parameters
const requiredParams = [
  "PORT",
  "JWT_SECRET",
  "JWT_EXPIRATION",
  "LOG_LEVEL",
  "NODE_ENV",
  "DATABASE_URL",
];

// Check for missing parameters
const missingParams = [];
for (const param of requiredParams) {
  if (!process.env[param] || process.env[param].trim() === "") {
    missingParams.push(param);
  }
}

// If any required parameters are missing, throw an error
if (missingParams.length > 0) {
  const errorMessage = `ERROR: Missing required configuration parameters: ${missingParams.join(
    ", "
  )}

All of the following parameters are required in your ${envFile} file:
- PORT: The port number on which the server will listen
- JWT_SECRET: Secret key used to sign JWT tokens
- JWT_EXPIRATION: Expiration time for JWT tokens (e.g., "2h", "1d")
- LOG_LEVEL: Logging level (debug, info, warn, error)
- NODE_ENV: Environment (development, qa, production, test)
- DATABASE_URL: URL for the database connection

Please add the missing parameters to your environment file and try again.`;

  console.error(errorMessage);
  process.exit(1); // Exit with error code
}

// Export configuration with validated parameters
export default {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION,
  logLevel: process.env.LOG_LEVEL,
  nodeEnv: process.env.NODE_ENV,
  databaseUrl: process.env.DATABASE_URL,
};
