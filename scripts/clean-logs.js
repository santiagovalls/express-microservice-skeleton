import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.resolve(__dirname, "../logs");
const winstonDir = path.resolve(logsDir, "winston");

/**
 * Removes all files from a directory
 * @param {string} directory - Path of the directory to clean
 * @param {boolean} removeDir - If true, also removes the directory
 */
function cleanDirectory(directory, removeDir = false) {
  if (!fs.existsSync(directory)) {
    console.log(`Directory ${directory} does not exist.`);
    return;
  }

  try {
    const files = fs.readdirSync(directory);

    for (const file of files) {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        cleanDirectory(filePath, true);
      } else {
        fs.unlinkSync(filePath);
        console.log(`File removed: ${filePath}`);
      }
    }

    if (removeDir) {
      fs.rmdirSync(directory);
      console.log(`Directory removed: ${directory}`);
    }
  } catch (error) {
    console.error(`Error cleaning directory ${directory}:`, error);
  }
}

// Clean Winston audit directory
console.log("Cleaning Winston audit...");
cleanDirectory(winstonDir, true);

// Clean log files
console.log("Cleaning log files...");
cleanDirectory(logsDir, false);

// Recreate Winston audit directory
fs.mkdirSync(winstonDir, { recursive: true });
console.log(`Directory recreated: ${winstonDir}`);

console.log("Cleaning completed successfully.");
