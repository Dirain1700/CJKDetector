"use strict";

import * as fs from "fs";
import * as path from "path";

import { DATA_DIR, RAW_DIR, DISTRIBUTED_CODES_DIR } from "./constants";
import { execSync } from "./tools";

export interface IDetectorConfig {
    includeCodesForJa?: string[];
    excludeCodesForJa?: string[];
    includeCodesForZh?: string[];
    excludeCodesForZh?: string[];
}

const CONFIG_INDEX = path.join(DATA_DIR, "config.json");
const UNIHAN_ZIP = path.join(RAW_DIR, "Unihan.zip");
const UNIHAN_UNZIP_DIR = path.join(RAW_DIR, "Unihan");
const UNIHAN_READINGS_INDEX = path.join(UNIHAN_UNZIP_DIR, "Unihan_Readings.txt");
const JAPANESE_CODES_ENTRY_POINT = path.join(DISTRIBUTED_CODES_DIR, "japanese.txt");
const CHINESE_CODES_ENTRY_POINT = path.join(DISTRIBUTED_CODES_DIR, "chinese.txt");
const NEW_LINE = "\n";
const SPACE = "\t";
const HASH = "#";

const config = JSON.parse(fs.readFileSync(CONFIG_INDEX, "utf-8")) as IDetectorConfig;

if (!fs.existsSync(UNIHAN_ZIP)) {
    console.error("Unihan.zip not found. Please download it first.");
}

if (process.platform === "win32") {
    fs.mkdirSync(UNIHAN_UNZIP_DIR, { recursive: true });
    execSync("tar -xf " + UNIHAN_ZIP + " -C " + UNIHAN_UNZIP_DIR, { cwd: process.cwd() });
} else {
    execSync("unzip -o " + UNIHAN_ZIP + " -d " + UNIHAN_UNZIP_DIR, { cwd: process.cwd() });
}

const UnihanReadings = fs.readFileSync(UNIHAN_READINGS_INDEX, "utf-8");

const JapaneseKun: string[] = [];
const JapaneseOn: string[] = [];
const Mandarin: string[] = [];
const Cantonese: string[] = [];

for (const line of UnihanReadings.split(NEW_LINE)) {
    if (line.startsWith(HASH)) continue;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const splitLines: [string, string, ...string[]] = line.trim().split(SPACE) as any as [string, string, ...string[]];
    const [stringCode, stringType] = splitLines;
    switch (stringType) {
        case "kJapaneseKun": {
            JapaneseKun.push(stringCode);
            break;
        }

        case "kJapaneseOn": {
            JapaneseOn.push(stringCode);
            break;
        }

        case "kMandarin": {
            Mandarin.push(stringCode);
            break;
        }

        case "kCantonese": {
            Cantonese.push(stringCode);
            break;
        }

        default:
            continue;
    }
}

console.log();
console.log("----------------- Extracted logs ------------------");
console.log();
console.log("Japanese Kun pronunciations:", JapaneseKun.length);
console.log("Japanese On  pronunciations:", JapaneseOn.length);
console.log("Mandarin     pronunciations:", Mandarin.length);
console.log("Cantonese    pronunciations:", Cantonese.length);
console.log();
console.log("---------------------------------------------------");
console.log();

let Japanese: number[] = Array.from(new Set([...JapaneseKun, ...JapaneseOn])).map((e) => parseInt(e.slice(2), 16));
let Chinese: number[] = Array.from(new Set([...Mandarin, ...Cantonese])).map((e) => parseInt(e.slice(2), 16));

for (const str of config.includeCodesForZh || []) {
    const unicode = str.codePointAt(0);
    if (unicode && !Chinese.includes(unicode)) Chinese.push(unicode);
}

for (const str of config.excludeCodesForZh || []) {
    const unicode = str.codePointAt(0);
    if (unicode) Chinese = Chinese.filter((e) => e !== unicode);
}

for (const str of config.includeCodesForJa || []) {
    const unicode = str.codePointAt(0);
    if (unicode && !Japanese.includes(unicode)) Japanese.push(unicode);
}

for (const str of config.excludeCodesForJa || []) {
    const unicode = str.codePointAt(0);
    if (unicode) Japanese = Japanese.filter((e) => e !== unicode);
}

Japanese.sort((a, b) => a - b);
Chinese.sort((a, b) => a - b);

console.log("---------- Extracted Logs (No duplicate) ----------");
console.log();
console.log("Japanese characters:", Japanese.length);
console.log("Chinese  characters:", Chinese.length);
console.log();
console.log("---------------------------------------------------");

function toCodeString(input: number): string {
    const str = input.toString(16);
    return str.length > 4 ? `\\u{${str}}` : `\\u${str}`;
}

function buildCode([latestBuiltCode, previousBuiltCode, previousCode]: [string, number, number]): string {
    return previousBuiltCode === previousCode
        ? latestBuiltCode + toCodeString(previousBuiltCode)
        : latestBuiltCode +
              toCodeString(previousBuiltCode) +
              (previousCode - previousBuiltCode === 1 ? "" : "-") +
              toCodeString(previousCode);
}

function generateRegExpSource(arr: number[]): string {
    const sum = arr.reduce(
        (previousBuiltCode: [string, number, number], currentCode: number): [string, number, number] => {
            if (previousBuiltCode[1] < 0) return [previousBuiltCode[0], currentCode, currentCode];
            if (currentCode - previousBuiltCode[2] === 1)
                return [previousBuiltCode[0], previousBuiltCode[1], currentCode];

            return [buildCode(previousBuiltCode), currentCode, currentCode];
        },
        ["", -1, -1]
    );
    if (sum[1] === -1) return "";
    return buildCode(sum);
}

execSync("mkdir -p " + DISTRIBUTED_CODES_DIR);

fs.writeFileSync(JAPANESE_CODES_ENTRY_POINT, generateRegExpSource(Japanese));
fs.writeFileSync(CHINESE_CODES_ENTRY_POINT, generateRegExpSource(Chinese));

console.log();
console.log("Done");
