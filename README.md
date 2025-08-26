# @dirain/CJKDetector

You can detect Chinese and Japanese characters easily with your own config!

## Setup

1. `npx @dirain/cjkdetector init`
2. Edit your config.json
3. `npx @dirain/cjkdetector download` (Please confirm the download link is safe)
4. `npx @dirain/cjkdetector setup`
5. Call from your code!

## Classes

```ts
export declare class CJKDetectorStatic {
    #private;
    static zhRegExp: RegExp;
    static jaRegExp: RegExp;
    static init(): void;
    static hasChineseCharacters(text: string): boolean;
    static hasJapaneseCharacters(text: string): boolean;
    static isChineseSentence(text: string): boolean;
    static isJapaneseSentence(text: string): boolean;
    static match(text: string): LangDetectionResult;
}

export declare class CJKDetector {
    hasChineseCharacters: boolean;
    hasJapaneseCharacters: boolean;
    isChineseSentence: boolean;
    isJapaneseSentence: boolean;
    chineseCharacters: string[];
    japaneseCharacters: string[];
    result: LangDetectionResult;
    constructor(text: string, init?: boolean);
}
```

`CJKDetectorStatic` is a static class of `CJKDetector`. Please call `CJKDetectorStatic.init()` before use.
