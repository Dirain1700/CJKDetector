"use strict";

import * as fs from "node:fs";
import * as path from "node:path";

import type { LangDetectionResult } from "../types/detect";

export const DATA_DIR = process.env.UNIHAN_DATA_DIR || "./unihan_data";
export const DISTRIBUTED_CODES_DIR = path.join(DATA_DIR, "result");

export class CJKDetectorStatic {
    static zhRegExp = new RegExp("[]");
    static jaRegExp = new RegExp("[]");

    static init(): void {
        const zhRegExpTexts = fs.readFileSync(path.join(DISTRIBUTED_CODES_DIR, "chinese.txt"), "utf-8").trim();
        const jaRegExpTexts = fs.readFileSync(path.join(DISTRIBUTED_CODES_DIR, "japanese.txt"), "utf-8").trim();

        CJKDetectorStatic.zhRegExp = new RegExp(`[${zhRegExpTexts}]`, "imu");
        CJKDetectorStatic.jaRegExp = new RegExp(`[${jaRegExpTexts}\u3040-\u309F\u30A0-\u30FF]`, "imu");
    }

    static hasChineseCharacters(text: string): boolean {
        return CJKDetectorStatic.zhRegExp.test(text);
    }

    static hasJapaneseCharacters(text: string): boolean {
        return CJKDetectorStatic.jaRegExp.test(text);
    }

    static isChineseSentence(text: string): boolean {
        return CJKDetectorStatic.match(text).lang === "ZH";
    }

    static isJapaneseSentence(text: string): boolean {
        return CJKDetectorStatic.match(text).lang === "JA";
    }

    static #getChineseCharacters(text: string): string[] {
        return text.split("").filter((e) => CJKDetectorStatic.zhRegExp.test(e));
    }

    static #getJapaneseCharacters(text: string): string[] {
        return text.split("").filter((e) => CJKDetectorStatic.jaRegExp.test(e));
    }

    static match(text: string): LangDetectionResult {
        const result: LangDetectionResult = {
            lang: "JA",
            text,
            japaneseStrings: [],
            chineseStrings: [],
            otherStrings: [],
        };

        const jaMatch = CJKDetectorStatic.#getJapaneseCharacters(text);
        result.japaneseStrings = jaMatch;
        if (jaMatch.length) {
            for (const str of jaMatch) {
                text = text.replace(str, "");
            }
        }
        const zhMatch = CJKDetectorStatic.#getChineseCharacters(text);
        result.chineseStrings = zhMatch;
        if (zhMatch.length) {
            for (const str of zhMatch) {
                text = text.replace(str, "");
            }
        }
        result.otherStrings = text.split("");
        result.lang = jaMatch.length > zhMatch.length ? "JA" : zhMatch.length ? "ZH" : "";

        return result;
    }
}

export class CJKDetector {
    hasChineseCharacters: boolean;
    hasJapaneseCharacters: boolean;
    isChineseSentence: boolean;
    isJapaneseSentence: boolean;
    chineseCharacters: string[];
    japaneseCharacters: string[];
    result: LangDetectionResult;

    constructor(text: string, init?: boolean) {
        if (init) {
            CJKDetectorStatic.init();
        }

        const result: LangDetectionResult = {
            lang: "JA",
            text,
            japaneseStrings: [],
            chineseStrings: [],
            otherStrings: [],
        };

        const jaMatch = text.split("").filter((e) => CJKDetectorStatic.jaRegExp.test(e));
        result.japaneseStrings = jaMatch;
        if (jaMatch.length) {
            for (const str of jaMatch) {
                text = text.replace(str, "");
            }
        }
        const zhMatch = text.split("").filter((e) => CJKDetectorStatic.zhRegExp.test(e));
        result.chineseStrings = zhMatch;
        if (zhMatch.length) {
            result.lang = "ZH";
            for (const str of zhMatch) {
                text = text.replace(str, "");
            }
        }
        result.otherStrings = text.split("");
        result.lang = zhMatch.length ? "ZH" : jaMatch.length ? "JA" : "";

        this.hasChineseCharacters = !!result.chineseStrings.length;
        this.hasJapaneseCharacters = !!result.japaneseStrings.length;
        this.isChineseSentence = result.lang === "ZH";
        this.isJapaneseSentence = result.lang === "JA";
        this.chineseCharacters = result.chineseStrings;
        this.japaneseCharacters = result.japaneseStrings;
        this.result = result;
    }
}
