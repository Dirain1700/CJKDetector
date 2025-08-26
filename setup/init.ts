"use strict";

import * as fs from "node:fs";
import * as path from "node:path";

import { DATA_DIR } from "./constants";

const CONFIG_EXAMPLE_DIR = path.join(__dirname, "../../unihan_data");
const CONFIG_COPYING_DIR = path.join(process.cwd(), DATA_DIR);

if (fs.existsSync(CONFIG_COPYING_DIR)) {
    throw new Error("Unihan directory already exists.");
}

fs.cpSync(CONFIG_EXAMPLE_DIR, CONFIG_COPYING_DIR, { recursive: true });
