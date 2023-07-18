"use strict";

import * as fs from "node:fs";
import * as path from "node:path";

import { build, buildSync } from "esbuild";
import { aliasPath } from "esbuild-plugin-alias-path";
import { globSync } from "glob";
import { cloneDeep } from "lodash";

const utilityFiles = ["build.ts", "tsc.ts"].map((e) => path.resolve(__dirname, e));
const setupFiles = globSync(["setup/**/*.ts"]).map((e) => path.resolve(__dirname, e));
const targetFiles = globSync(["src/**/*.ts"])
    .filter((e) => !e.endsWith("-source.ts"))
    .map((e) => path.resolve(__dirname, e));
const dataFiles = globSync(["data/result/*.txt"]).map((e) => path.resolve(__dirname, e));
const mainSourceFileName = path.resolve(__dirname, "src/detect-source.ts");
const mainFileName = path.resolve(__dirname, "src/detect.ts");
const exportSourceFileName = path.resolve(__dirname, "src/index-source.ts");
const exportFileName = path.resolve(__dirname, "src/index.ts");
const testFiles = globSync(["src/test/**/*.ts"]).map((e) => path.resolve(__dirname, e));
const ReadBasePath = path.resolve(__dirname, "types");
const WriteBasePath = path.resolve(__dirname, "dist/types");

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
    console.log("Generating files from extracted RegExp...");

    let jaUnicodes: string = "";
    let zhUnicodes: string = "";

    for (const dataFileName of dataFiles) {
        const dataFile = fs.readFileSync(dataFileName, "utf-8").trim().split("\n")[0]!;

        if (dataFileName.endsWith("chinese.txt")) zhUnicodes = dataFile;
        else if (dataFileName.endsWith("japanese.txt")) jaUnicodes = dataFile;
        else throw new Error("Unknown unicodes detected");
    }

    if (!zhUnicodes || !jaUnicodes) throw new Error("Empty Unicodes detected");

    const mainFileSource = fs
        .readFileSync(mainSourceFileName, "utf-8")
        .replaceAll("{ZH_REGEXP}", zhUnicodes)
        .replaceAll("{JA_REGEXP}", jaUnicodes);

    fs.writeFileSync(mainFileName, mainFileSource);

    const exportFileSource = fs.readFileSync(exportSourceFileName, "utf-8").replaceAll("-source", "");

    fs.writeFileSync(exportFileName, exportFileSource);

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
        minify: true,
        outdir: "dist/cjs/test",
        tsconfig: path.resolve(__dirname, "tsconfig.test.json"),
    }));

    fs.unlinkSync(mainFileName);
    fs.unlinkSync(exportFileName);
}
