import { execSync } from "child_process";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../");

// Set default NODE_ENV if not provided
const nodeEnv = process.env.NODE_ENV || "development";
console.log(`Setting up database for ${nodeEnv} environment...`);

// Load environment variables from the appropriate .env file
const envFile = `.env.${nodeEnv}`;
const envPath = path.resolve(rootDir, envFile);

// Check if the env file exists
if (!fs.existsSync(envPath)) {
  console.error(`ERROR: Environment file ${envFile} not found at ${envPath}`);
  process.exit(1);
}

// Load environment variables from the specific .env file
const envConfig = dotenv.config({ path: envPath });
console.log(`Loaded environment variables from ${envFile}`);

// Create a new environment with the loaded variables
const env = { ...process.env, ...envConfig.parsed };

try {
  // Generate Prisma client
  console.log("Generating Prisma client...");
  execSync("npx prisma generate", {
    stdio: "inherit",
    env,
  });

  // Create migrations
  console.log("Creating migrations...");
  execSync(`npx prisma migrate dev --name init`, {
    stdio: "inherit",
    env,
  });

  console.log("Database setup completed successfully!");
} catch (error) {
  console.error(`Error setting up database: ${error.message}`);
  process.exit(1);
}
