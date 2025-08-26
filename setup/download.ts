"use strict";

import * as fs from "node:fs";
import * as https from "node:https";
import * as path from "node:path";

import { RAW_DIR } from "./constants";

const UNIHAN_URL = "https://www.unicode.org/Public/UNIDATA/Unihan.zip";
const ZIP_INDEX = path.join(RAW_DIR, "Unihan.zip");

fs.mkdirSync(RAW_DIR, { recursive: true });

const force = process.argv.some((arg) => ["-f", "--force"].includes(arg));
const isZipExists = fs.existsSync(ZIP_INDEX);

if (isZipExists && !force) {
    const lastLocalModified = fs.statSync(ZIP_INDEX).mtime;

    https
        .request(UNIHAN_URL, { method: "HEAD" }, (res) => {
            const lastRemoteModifiedStr = res.headers["last-modified"];
            if (lastRemoteModifiedStr) {
                if (lastLocalModified > new Date(lastRemoteModifiedStr)) {
                    console.log("Local Unihan.zip is up-to-date.");
                    process.exit(0);
                }
            } else {
                console.log("Could not get last-modified header. To update forcefully, run with -f flag.");
            }
        })
        .on("error", (err) => {
            throw new Error("Error checking remote Unihan.zip:", err);
        })
        .end();
}

https
    .get(UNIHAN_URL, (res) => {
        const totalSize = parseInt(res.headers["content-length"] || "0", 10);
        let downloadedSize = 0;

        const stream = fs.createWriteStream(ZIP_INDEX);
        res.pipe(stream);

        res.on("data", (chunk: Buffer) => {
            downloadedSize += chunk.length;
            if (totalSize) {
                const progress = Math.floor((downloadedSize / totalSize) * 20); // 20段階の進捗
                const progressBar = `[${"=".repeat(progress)}${" ".repeat(20 - progress)}]`;
                process.stdout.write(
                    `\rDownloading... ${progressBar} ${((downloadedSize / totalSize) * 100).toFixed(2)}%`
                );
            } else {
                process.stderr.write(`\rDownloading... ${downloadedSize} bytes`);
            }
        });

        stream.on("finish", () => {
            console.log("\nSuccessfully downloaded Unihan.zip");
        });

        stream.on("error", (err) => {
            console.error("Error downloading Unihan.zip:", err);
        });
    })
    .on("error", (err) => {
        throw new Error("Error while downloading:", err);
    });
