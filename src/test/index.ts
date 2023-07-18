"use strict";

import * as assert from "assert";

import { detectChineseStatic, detectChinese } from "../index";

import type { LangDetectionResult } from "../index";

console.log();
//console.log("\x1b[1mCurrently unit test should not be ran cause of their bugs.");
process.stdout.write("\x1b[0m");
//process.exit();

describe("DetectChineseStatic", function () {
    it("should detect Chinese strings", function () {
        assert.ok(detectChineseStatic.hasChineseCharacters("不知道"));
        assert.ok(detectChineseStatic.hasChineseCharacters("こんにちは。你好"));
        // This line is broken on mocha test, but works correctly out of the test
        assert.ok(detectChineseStatic.hasChineseCharacters("再见"));
        assert.ok(!detectChineseStatic.hasChineseCharacters("hello"));
        assert.ok(!detectChineseStatic.hasChineseCharacters("おはよう"));
        assert.ok(detectChineseStatic.hasChineseCharacters("吉"));
        assert.ok(detectChineseStatic.hasChineseCharacters("芳香環"));
        assert.ok(detectChineseStatic.hasChineseCharacters("谢谢"));
    });
    it("should detect Japanese strings", function () {
        assert.ok(detectChineseStatic.hasJapaneseCharacters("不知道"));
        assert.ok(detectChineseStatic.hasJapaneseCharacters("こんにちは。你好"));
        assert.ok(detectChineseStatic.hasJapaneseCharacters("再见"));
        assert.ok(!detectChineseStatic.hasJapaneseCharacters("hello"));
        assert.ok(detectChineseStatic.hasJapaneseCharacters("おはよう"));
        assert.ok(detectChineseStatic.hasJapaneseCharacters("吉"));
        assert.ok(detectChineseStatic.hasJapaneseCharacters("芳香環"));
        assert.ok(!detectChineseStatic.hasJapaneseCharacters("谢谢"));
    });
    it("should judge is this Chinese sentence correctly", function () {
        assert.ok(detectChineseStatic.isChineseSentence("不知道"));
        assert.ok(detectChineseStatic.isChineseSentence("こんにちは。你好"));
        assert.ok(detectChineseStatic.isChineseSentence("再见"));
        assert.ok(!detectChineseStatic.isChineseSentence("hello"));
        assert.ok(!detectChineseStatic.isChineseSentence("おはよう"));
        assert.ok(detectChineseStatic.isChineseSentence("吉"));
        assert.ok(detectChineseStatic.isChineseSentence("芳香環"));
        assert.ok(detectChineseStatic.isChineseSentence("谢谢"));
    });
    it("should judge is this Japanese sentence correctly", function () {
        assert.ok(detectChineseStatic.isJapaneseSentence("不知道"));
        assert.ok(detectChineseStatic.isJapaneseSentence("こんにちは。你好"));
        assert.ok(detectChineseStatic.isJapaneseSentence("再见"));
        assert.ok(!detectChineseStatic.isJapaneseSentence("hello"));
        assert.ok(!detectChineseStatic.isJapaneseSentence("おはよう"));
        assert.ok(detectChineseStatic.isJapaneseSentence("吉"));
        assert.ok(detectChineseStatic.isJapaneseSentence("芳香環"));
        assert.ok(detectChineseStatic.isJapaneseSentence("谢谢"));
    });
    it("should return array of Chinese strings correctly", function () {
        assert.strictEqual(detectChineseStatic.getChineseCharacters("不知道"), ["不", "知", "道"]);
        assert.strictEqual(detectChineseStatic.getChineseCharacters("こんにちは。你好"), ["你", "好"]);
        assert.strictEqual(detectChineseStatic.getChineseCharacters("再见"), ["再", "见"]);
        assert.strictEqual(!detectChineseStatic.getChineseCharacters("hello"), []);
        assert.strictEqual(!detectChineseStatic.getChineseCharacters("おはよう"), []);
        assert.strictEqual(detectChineseStatic.getChineseCharacters("吉"), ["吉"]);
        assert.strictEqual(detectChineseStatic.getChineseCharacters("芳香環"), ["芳", "香", "環"]);
        assert.strictEqual(detectChineseStatic.getChineseCharacters("谢谢"), ["谢", "谢"]);
    });
    it("should return array of Japanese strings correctly", function () {
        assert.strictEqual(detectChineseStatic.getJapaneseCharacters("不知道"), ["不", "知", "道"]);
        assert.strictEqual(detectChineseStatic.getJapaneseCharacters("こんにちは。你好"), [
            "こ",
            "ん",
            "に",
            "ち",
            "は",
            "好",
        ]);
        assert.strictEqual(detectChineseStatic.getJapaneseCharacters("再见"), ["再"]);
        assert.strictEqual(!detectChineseStatic.getJapaneseCharacters("hello"), []);
        assert.strictEqual(!detectChineseStatic.getJapaneseCharacters("おはよう"), ["お", "は", "よ", "う"]);
        assert.strictEqual(detectChineseStatic.getJapaneseCharacters("吉"), ["吉"]);
        assert.strictEqual(detectChineseStatic.getJapaneseCharacters("芳香環"), ["芳", "香", "環"]);
        assert.strictEqual(detectChineseStatic.getJapaneseCharacters("谢谢"), []);
    });
    it("should detect language correctly", function () {
        assert.strictEqual(detectChineseStatic.match("不知道"), {
            lang: "JA",
            text: "不知道",
            chineseStrings: [],
            japaneseStrings: ["不", "知", "道"],
            otherStrings: [],
        });
        assert.strictEqual(detectChineseStatic.match("こんにちは。你好"), {
            lang: "ZH",
            text: "こんにちは。你好",
            chineseStrings: ["你"],
            japaneseStrings: ["こ", "ん", "に", "ち", "は", "好"],
            otherStrings: ["。"],
        });
        assert.strictEqual(detectChineseStatic.match("再见"), {
            lang: "ZH",
            text: "再见",
            chineseStrings: ["见"],
            japaneseStrings: ["再"],
            otherStrings: [],
        });
        assert.strictEqual(detectChineseStatic.match("哪里"), {
            lang: "ZH",
            text: "哪里",
            chineseStrings: ["哪"],
            japaneseStrings: ["里"],
            otherStrings: [],
        });
        assert.strictEqual(detectChineseStatic.match("おはよう"), {
            lang: "JA",
            text: "おはよう",
            chineseStrings: [],
            japaneseStrings: ["お", "は", "よ", "う"],
            otherStrings: [],
        });
        assert.strictEqual(detectChineseStatic.match("吉"), {
            lang: "JA",
            text: "吉",
            chineseStrings: [],
            japaneseStrings: ["吉"],
            otherStrings: [],
        });
        assert.strictEqual(detectChineseStatic.match("芳香環"), {
            lang: "JA",
            text: "芳香環",
            chineseStrings: [],
            japaneseStrings: ["芳", "香", "環"],
            otherStrings: [],
        });
        assert.strictEqual(detectChineseStatic.match("谢谢"), {
            lang: "ZH",
            text: "谢谢",
            chineseStrings: ["谢", "谢"],
            japaneseStrings: [],
            otherStrings: [],
        });
    });
});
/*
describe("DetectChinese", function () {
    const instance1 = new detectChinese("不知道");
    const instance2 = new detectChinese("こんにちは。你好");
    const instance3 = new detectChinese("再见");
    const instance4 = new detectChinese("hello");
    const instance5 = new detectChinese("おはよう");
    const instance6 = new detectChinese("吉");
    const instance7 = new detectChinese("芳香環");
    const instance8 = new detectChinese("谢谢");
    it("should detect Chinese strings", function () {
        assert.ok(instance1.hasChineseCharacters);
        assert.ok(instance2.hasChineseCharacters);
        assert.ok(instance3.hasChineseCharacters);
        assert.ok(!instance4.hasChineseCharacters);
        assert.ok(!instance5.hasChineseCharacters);
        assert.ok(instance6.hasChineseCharacters);
        assert.ok(instance7.hasChineseCharacters);
        assert.ok(instance8.hasChineseCharacters);
    });
    it("should detect Japanese strings", function () {
        assert.ok(instance1.hasJapaneseCharacters);
        assert.ok(instance2.hasJapaneseCharacters);
        assert.ok(instance3.hasJapaneseCharacters);
        assert.ok(!instance4.hasJapaneseCharacters);
        assert.ok(instance5.hasJapaneseCharacters);
        assert.ok(instance6.hasJapaneseCharacters);
        assert.ok(instance7.hasJapaneseCharacters);
        assert.ok(!instance8.hasJapaneseCharacters);
    });
    it("should judge is this Chinese sentence correctly", function () {
        assert.ok(instance1.isChineseSentence);
        assert.ok(instance2.isChineseSentence);
        assert.ok(instance3.isChineseSentence);
        assert.ok(!instance4.isChineseSentence);
        assert.ok(!instance5.isChineseSentence);
        assert.ok(instance6.isChineseSentence);
        assert.ok(instance7.isChineseSentence);
        assert.ok(instance8.isChineseSentence);
    });
    it("should judge is this Japanese sentence correctly", function () {
        assert.ok(instance1.isJapaneseSentence);
        assert.ok(!instance2.isJapaneseSentence);
        assert.ok(!instance3.isJapaneseSentence);
        assert.ok(!instance4.isJapaneseSentence);
        assert.ok(instance5.isJapaneseSentence);
        assert.ok(instance6.isJapaneseSentence);
        assert.ok(instance7.isJapaneseSentence);
        assert.ok(!instance8.isJapaneseSentence);
    });
    it("should return array of Chinese strings correctly", function () {
        assert.strictEqual(instance1.chineseCharacters, ["不", "知", "道"]);
        assert.strictEqual(instance2.chineseCharacters, ["你", "好"]);
        assert.strictEqual(instance3.chineseCharacters, ["再", "见"]);
        assert.strictEqual(instance4.chineseCharacters, []);
        assert.strictEqual(instance5.chineseCharacters, []);
        assert.strictEqual(instance6.chineseCharacters, ["吉"]);
        assert.strictEqual(instance7.chineseCharacters, ["芳", "香", "環"]);
        assert.strictEqual(instance8.chineseCharacters, ["谢", "谢"]);
    });
    it("should return array of Japanese strings correctly", function () {
        assert.strictEqual(instance1.japaneseCharacters, ["不", "知", "道"]);
        assert.strictEqual(instance2.japaneseCharacters, ["こ", "ん", "に", "ち", "は", "好"]);
        assert.strictEqual(instance3.japaneseCharacters, ["再"]);
        assert.strictEqual(instance4.japaneseCharacters, []);
        assert.strictEqual(instance5.japaneseCharacters, ["お", "は", "よ", "う"]);
        assert.strictEqual(instance6.japaneseCharacters, ["吉"]);
        assert.strictEqual(instance7.japaneseCharacters, ["芳", "香", "環"]);
        assert.strictEqual(instance8.japaneseCharacters, []);
    });
    it("should detect language correctly", function () {
        assert.strictEqual(instance1.result, {
            lang: "JA",
            text: "不知道",
            chineseStrings: [],
            japaneseStrings: ["不", "知", "道"],
            otherStrings: [],
        });
        assert.strictEqual(instance2.result, {
            lang: "ZH",
            text: "こんにちは。你好",
            chineseStrings: ["你"],
            japaneseStrings: ["こ", "ん", "に", "ち", "は", "好"],
            otherStrings: ["。"],
        });
        assert.strictEqual(instance3.result, {
            lang: "ZH",
            text: "再见",
            chineseStrings: ["见"],
            japaneseStrings: ["再"],
            otherStrings: [],
        });
        assert.strictEqual(instance4.result, {
            lang: "ZH",
            text: "哪里",
            chineseStrings: ["哪"],
            japaneseStrings: ["里"],
            otherStrings: [],
        });
        assert.strictEqual(instance5.result, {
            lang: "JA",
            text: "おはよう",
            chineseStrings: [],
            japaneseStrings: ["お", "は", "よ", "う"],
            otherStrings: [],
        });
        assert.strictEqual(instance6.result, {
            lang: "JA",
            text: "吉",
            chineseStrings: [],
            japaneseStrings: ["吉"],
            otherStrings: [],
        });
        assert.strictEqual(instance7.result, {
            lang: "JA",
            text: "芳香環",
            chineseStrings: [],
            japaneseStrings: ["芳", "香", "環"],
            otherStrings: [],
        });
        assert.strictEqual(instance8.result, {
            lang: "ZH",
            text: "谢谢",
            chineseStrings: ["谢", "谢"],
            japaneseStrings: [],
            otherStrings: [],
        });
    });
});
*/
