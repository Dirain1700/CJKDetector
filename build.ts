"use strict";

import * as fs from "node:fs";
import * as path from "node:path";

import { buildSync } from "esbuild";
import { globSync } from "glob";
import { cloneDeep } from "lodash";

const utilityFiles = ["build.ts"].map((e) => path.resolve(__dirname, e));
const setupFiles = globSync(["setup/**/*.ts"]).map((e) => path.resolve(__dirname, e));
const targetFiles = globSync(["src/*.ts"]).map((e) => path.resolve(__dirname, e));
const dataFiles = globSync(["data/result/*.txt"]).map((e) => path.resolve(__dirname, e));
const mainFileName = path.resolve(__dirname, "src/detect.ts");
const exportFileName = path.resolve(__dirname, "src/index.ts");
const testFiles = globSync(["src/test/*.ts"]).map((e) => path.resolve(__dirname, e));

const config = {
    allowOverwrite: true,
    entryPoints: targetFiles,
    platform: "node",
    target: "esnext",
    sourcemap: true,
    sourcesContent: false,
    write: true,
};

console.log("Transpiling utility files...");

// @ts-expect-error format should be assignable
// prettier-ignore
buildSync(Object.assign(cloneDeep(config), {
    entryPoints: utilityFiles,
    format: "cjs",
    outdir: path.resolve(__dirname, "./"),
    tsconfig: path.resolve(__dirname, "tsconfig.build.json"),
}));

console.log("Transpiling setup files...");

// @ts-expect-error format should be assignable
// prettier-ignore
buildSync(Object.assign(cloneDeep(config), {
    entryPoints: setupFiles,
    format: "cjs",
    outdir: path.resolve(__dirname, "./dist/setup"),
    tsconfig: path.resolve(__dirname, "tsconfig.cjs.json"),
}));

if (dataFiles.length === 2) {
    console.log("Transpiling to CommonJS...");

    // @ts-expect-error format should be assignable
    // prettier-ignore
    buildSync(Object.assign(cloneDeep(config), {
        entryPoints: [mainFileName, exportFileName],
        format: "cjs",
        outdir: path.resolve(__dirname, "./dist/cjs"),
        tsconfig: path.resolve(__dirname, "tsconfig.cjs.json"),
    }));

    console.log("Transpiling to ES Module...");

    // @ts-expect-error format should be assignable
    // prettier-ignore
    buildSync(Object.assign(cloneDeep(config), {
        entryPoints: [mainFileName, exportFileName],
        format: "esm",
        outExtension: { ".js": ".mjs" },
        outdir: path.resolve(__dirname, "./dist/esm"),
        tsconfig: path.resolve(__dirname, "tsconfig.esm.json"),
    }));

    console.log("copying type definition modules...");

    const regex = /"\.\.\/src\//g;
    const ReadBasePath = "./types";
    const WriteBasePath = "./dist/types";

    if (!fs.existsSync(WriteBasePath)) fs.mkdirSync(WriteBasePath, { recursive: true });

    for (const FileName of fs.readdirSync(ReadBasePath)) {
        const ReadFilePath = ReadBasePath + "/" + FileName;
        const WriteFilePath = WriteBasePath + "/" + FileName;
        const Changes = fs.readFileSync(ReadFilePath, "utf-8").replaceAll(regex, '"../../src/').trim();
        fs.writeFileSync(WriteFilePath, Changes);
    }

    console.log("Transpiling test modules...");
    // @ts-expect-error format should be assignable
    // prettier-ignore
    buildSync(Object.assign(cloneDeep(config), {
        bundle: true,
        entryPoints: testFiles,
        format: "cjs",
        minify: false,
        outdir: "dist/cjs/test",
        tsconfig: path.resolve(__dirname, "tsconfig.test.json"),
    }));
}
