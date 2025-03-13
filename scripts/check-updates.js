import { exec } from "child_process";

console.log("Checking for available updates...");

// Execute npm outdated and capture the output
exec("npm outdated", (error, stdout, stderr) => {
  if (stdout) {
    console.log("\nOutdated packages:");
    console.log(stdout);
  } else {
    console.log("\nAll packages are up to date.");
  }

  if (stderr) {
    console.error("\nWarnings:");
    console.error(stderr);
  }

  // Always exit with code 0 to avoid interrupting the flow
  process.exit(0);
});
