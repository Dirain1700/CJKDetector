#! /usr/bin/env node

"use strict";

import { join } from "node:path";
import { pathToFileURL } from "node:url";

const files: Record<string, string> = {
    init: join(__dirname, "./init.js"),
    download: join(__dirname, "./download.js"),
    setup: join(__dirname, "./setup.js"),
};

for (const arg of process.argv.slice(2)) {
    const file = files[arg];
    if (file) {
        import(pathToFileURL(file).href).catch(() => {
            console.error(`command Failed: ${arg}`);
            console.error(`Error loading ${file}`);
            process.exit(1);
        });
        break;
    } else {
        console.error(`Unknown command: ${arg}`);
        process.exit(1);
    }
}
