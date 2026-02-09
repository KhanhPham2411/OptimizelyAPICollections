#!/usr/bin/env node
/**
 * clean-data-files.mjs
 * Removes all .data files under the project directory (Thor Client response/cache files).
 */

import { readdirSync, unlinkSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = __dirname;

function* walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".data")) {
      yield fullPath;
    }
  }
}

const found = [...walk(projectRoot)];
if (found.length === 0) {
  console.log("No .data files found.");
  process.exit(0);
}

for (const file of found) {
  try {
    unlinkSync(file);
    console.log("Removed:", file.replace(projectRoot + "\\", "").replace(projectRoot + "/", ""));
  } catch (err) {
    console.error("Failed to remove:", file, err.message);
  }
}

console.log(`Done. Cleaned ${found.length} .data file(s).`);
