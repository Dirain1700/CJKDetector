"use strict";

import * as assert from "assert";

import { CJKDetectorStatic, CJKDetector } from "../index";

console.log();
process.stdout.write("\x1b[0m");

CJKDetectorStatic.init();

describe("DetectChineseStatic", function () {
    it("should detect Chinese strings", function () {
        assert.ok(CJKDetectorStatic.hasChineseCharacters("不知道"));
        assert.ok(CJKDetectorStatic.hasChineseCharacters("こんにちは。你好"));
        // This line is broken on mocha test, but works correctly out of the test
        assert.ok(CJKDetectorStatic.hasChineseCharacters("再见"));
        assert.ok(!CJKDetectorStatic.hasChineseCharacters("hello"));
        assert.ok(!CJKDetectorStatic.hasChineseCharacters("おはよう"));
        assert.ok(CJKDetectorStatic.hasChineseCharacters("吉"));
        assert.ok(CJKDetectorStatic.hasChineseCharacters("芳香環"));
        assert.ok(CJKDetectorStatic.hasChineseCharacters("谢谢"));
    });
    it("should detect Japanese strings", function () {
        assert.ok(CJKDetectorStatic.hasJapaneseCharacters("不知道"));
        assert.ok(CJKDetectorStatic.hasJapaneseCharacters("こんにちは。你好"));
        assert.ok(CJKDetectorStatic.hasJapaneseCharacters("再见"));
        assert.ok(!CJKDetectorStatic.hasJapaneseCharacters("hello"));
        assert.ok(CJKDetectorStatic.hasJapaneseCharacters("おはよう"));
        assert.ok(CJKDetectorStatic.hasJapaneseCharacters("吉"));
        assert.ok(CJKDetectorStatic.hasJapaneseCharacters("芳香環"));
        assert.ok(!CJKDetectorStatic.hasJapaneseCharacters("谢谢"));
    });
    it("should judge is this Chinese sentence correctly", function () {
        assert.ok(!CJKDetectorStatic.isChineseSentence("不知道"));
        assert.ok(!CJKDetectorStatic.isChineseSentence("こんにちは。你好"));
        assert.ok(CJKDetectorStatic.isChineseSentence("再见"));
        assert.ok(!CJKDetectorStatic.isChineseSentence("hello"));
        assert.ok(!CJKDetectorStatic.isChineseSentence("おはよう"));
        assert.ok(!CJKDetectorStatic.isChineseSentence("吉"));
        assert.ok(!CJKDetectorStatic.isChineseSentence("芳香環"));
        assert.ok(CJKDetectorStatic.isChineseSentence("谢谢"));
    });
    it("should judge is this Japanese sentence correctly", function () {
        assert.ok(CJKDetectorStatic.isJapaneseSentence("不知道"));
        assert.ok(CJKDetectorStatic.isJapaneseSentence("こんにちは。你好"));
        assert.ok(!CJKDetectorStatic.isJapaneseSentence("再见"));
        assert.ok(!CJKDetectorStatic.isJapaneseSentence("hello"));
        assert.ok(CJKDetectorStatic.isJapaneseSentence("おはよう"));
        assert.ok(CJKDetectorStatic.isJapaneseSentence("吉"));
        assert.ok(CJKDetectorStatic.isJapaneseSentence("芳香環"));
        assert.ok(!CJKDetectorStatic.isJapaneseSentence("谢谢"));
    });
    it("should detect language correctly", function () {
        assert.deepStrictEqual(CJKDetectorStatic.match("不知道"), {
            lang: "JA",
            text: "不知道",
            japaneseStrings: ["不", "知", "道"],
            chineseStrings: [],
            otherStrings: [],
        });
        assert.deepStrictEqual(CJKDetectorStatic.match("こんにちは。你好"), {
            lang: "JA",
            text: "こんにちは。你好",
            chineseStrings: ["你"],
            japaneseStrings: ["こ", "ん", "に", "ち", "は", "好"],
            otherStrings: ["。"],
        });
        assert.deepStrictEqual(CJKDetectorStatic.match("再见"), {
            lang: "ZH",
            text: "再见",
            chineseStrings: ["见"],
            japaneseStrings: ["再"],
            otherStrings: [],
        });
        assert.deepStrictEqual(CJKDetectorStatic.match("哪里"), {
            lang: "ZH",
            text: "哪里",
            chineseStrings: ["哪"],
            japaneseStrings: ["里"],
            otherStrings: [],
        });
        assert.deepStrictEqual(CJKDetectorStatic.match("おはよう"), {
            lang: "JA",
            text: "おはよう",
            chineseStrings: [],
            japaneseStrings: ["お", "は", "よ", "う"],
            otherStrings: [],
        });
        assert.deepStrictEqual(CJKDetectorStatic.match("吉"), {
            lang: "JA",
            text: "吉",
            chineseStrings: [],
            japaneseStrings: ["吉"],
            otherStrings: [],
        });
        assert.deepStrictEqual(CJKDetectorStatic.match("芳香環"), {
            lang: "JA",
            text: "芳香環",
            chineseStrings: [],
            japaneseStrings: ["芳", "香", "環"],
            otherStrings: [],
        });
        assert.deepStrictEqual(CJKDetectorStatic.match("谢谢"), {
            lang: "ZH",
            text: "谢谢",
            chineseStrings: ["谢", "谢"],
            japaneseStrings: [],
            otherStrings: [],
        });
    });
});

describe("DetectChinese", function () {
    const instance1 = new CJKDetector("不知道");
    const instance2 = new CJKDetector("こんにちは。你好");
    const instance3 = new CJKDetector("再见");
    const instance4 = new CJKDetector("hello");
    const instance5 = new CJKDetector("おはよう");
    const instance6 = new CJKDetector("吉");
    const instance7 = new CJKDetector("芳香環");
    const instance8 = new CJKDetector("谢谢");
    it("should detect Chinese strings", function () {
        assert.ok(!instance1.hasChineseCharacters);
        assert.ok(instance2.hasChineseCharacters);
        assert.ok(instance3.hasChineseCharacters);
        assert.ok(!instance4.hasChineseCharacters);
        assert.ok(!instance5.hasChineseCharacters);
        assert.ok(!instance6.hasChineseCharacters);
        assert.ok(!instance7.hasChineseCharacters);
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
        assert.ok(!instance1.isChineseSentence);
        assert.ok(instance2.isChineseSentence);
        assert.ok(instance3.isChineseSentence);
        assert.ok(!instance4.isChineseSentence);
        assert.ok(!instance5.isChineseSentence);
        assert.ok(!instance6.isChineseSentence);
        assert.ok(!instance7.isChineseSentence);
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
        assert.deepStrictEqual(instance1.chineseCharacters, []);
        assert.deepStrictEqual(instance2.chineseCharacters, ["你"]);
        assert.deepStrictEqual(instance3.chineseCharacters, ["见"]);
        assert.deepStrictEqual(instance4.chineseCharacters, []);
        assert.deepStrictEqual(instance5.chineseCharacters, []);
        assert.deepStrictEqual(instance6.chineseCharacters, []);
        assert.deepStrictEqual(instance7.chineseCharacters, []);
        assert.deepStrictEqual(instance8.chineseCharacters, ["谢", "谢"]);
    });
    it("should return array of Japanese strings correctly", function () {
        assert.deepStrictEqual(instance1.japaneseCharacters, ["不", "知", "道"]);
        assert.deepStrictEqual(instance2.japaneseCharacters, ["こ", "ん", "に", "ち", "は", "好"]);
        assert.deepStrictEqual(instance3.japaneseCharacters, ["再"]);
        assert.deepStrictEqual(instance4.japaneseCharacters, []);
        assert.deepStrictEqual(instance5.japaneseCharacters, ["お", "は", "よ", "う"]);
        assert.deepStrictEqual(instance6.japaneseCharacters, ["吉"]);
        assert.deepStrictEqual(instance7.japaneseCharacters, ["芳", "香", "環"]);
        assert.deepStrictEqual(instance8.japaneseCharacters, []);
    });
    it("should detect language correctly", function () {
        assert.deepStrictEqual(instance1.result, {
            lang: "JA",
            text: "不知道",
            chineseStrings: [],
            japaneseStrings: ["不", "知", "道"],
            otherStrings: [],
        });
        assert.deepStrictEqual(instance2.result, {
            lang: "ZH",
            text: "こんにちは。你好",
            chineseStrings: ["你"],
            japaneseStrings: ["こ", "ん", "に", "ち", "は", "好"],
            otherStrings: ["。"],
        });
        assert.deepStrictEqual(instance3.result, {
            lang: "ZH",
            text: "再见",
            chineseStrings: ["见"],
            japaneseStrings: ["再"],
            otherStrings: [],
        });
        assert.deepStrictEqual(instance4.result, {
            lang: "",
            text: "hello",
            chineseStrings: [],
            japaneseStrings: [],
            otherStrings: ["h", "e", "l", "l", "o"],
        });
        assert.deepStrictEqual(instance5.result, {
            lang: "JA",
            text: "おはよう",
            chineseStrings: [],
            japaneseStrings: ["お", "は", "よ", "う"],
            otherStrings: [],
        });
        assert.deepStrictEqual(instance6.result, {
            lang: "JA",
            text: "吉",
            chineseStrings: [],
            japaneseStrings: ["吉"],
            otherStrings: [],
        });
        assert.deepStrictEqual(instance7.result, {
            lang: "JA",
            text: "芳香環",
            chineseStrings: [],
            japaneseStrings: ["芳", "香", "環"],
            otherStrings: [],
        });
        assert.deepStrictEqual(instance8.result, {
            lang: "ZH",
            text: "谢谢",
            chineseStrings: ["谢", "谢"],
            japaneseStrings: [],
            otherStrings: [],
        });
    });
});
