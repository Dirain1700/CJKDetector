const { defineConfig, globalIgnores } = require("eslint/config");
const globals = require("globals");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const _import = require("eslint-plugin-import");
const { fixupPluginRules, includeIgnoreFile } = require("@eslint/compat");
const tsParser = require("@typescript-eslint/parser");
const path = require("node:path");
const js = require("@eslint/js");
const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

const gitIgnorePath = path.resolve(__dirname, ".gitignore");

module.exports = defineConfig([
    globalIgnores(["dist/*", "**/foo*", "**/*.js"]),
    includeIgnoreFile(gitIgnorePath),
    {
        extends: compat.extends("eslint:recommended"),

        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.commonjs,
            },

            ecmaVersion: "latest",
            sourceType: "commonjs",
        },

        rules: {
            "no-unused-vars": "error",
            semi: ["error", "always"],
            "comma-spacing": "error",
            "no-extra-semi": "error",

            quotes: [
                "off",
                "double",
                {
                    avoidEscape: true,
                },
            ],

            "no-var": "off",
            "no-trailing-spaces": "error",
        },
    },
    {
        files: ["*/**/*.ts"],

        extends: compat.extends(
            "eslint:recommended",
            "plugin:@typescript-eslint/recommended",
            "plugin:@typescript-eslint/recommended-requiring-type-checking"
        ),

        plugins: {
            "@typescript-eslint": typescriptEslint,
            import: fixupPluginRules(_import),
        },

        languageOptions: {
            parser: tsParser,
            ecmaVersion: 5,
            sourceType: "script",

            parserOptions: {
                project: ["./tsconfig.cjs.json"],
            },
        },

        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/prefer-ts-expect-error": "error",
            "@typescript-eslint/no-inferrable-types": "off",
            "@typescript-eslint/no-this-alias": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-unused-vars": "error",
            "@typescript-eslint/restrict-plus-operands": "off",
            "import/consistent-type-specifier-style": ["error", "prefer-top-level"],

            "import/order": [
                "error",
                {
                    groups: ["builtin", "external", "internal", "object", ["parent", "sibling"], "index", "type"],

                    pathGroups: [
                        {
                            pattern: "[!/]",
                            group: "type",
                            position: "before",
                        },
                        {
                            pattern: "../src/*",
                            group: "type",
                            position: "before",
                        },
                        {
                            pattern: "../types/*",
                            group: "type",
                            position: "after",
                        },
                    ],

                    distinctGroup: false,

                    alphabetize: {
                        order: "asc",
                    },

                    "newlines-between": "always-and-inside-groups",
                },
            ],
        },
    },
    {
        files: ["setup/**/*.ts"],

        languageOptions: {
            ecmaVersion: 5,
            sourceType: "script",

            parserOptions: {
                project: ["./tsconfig.setup.json"],
            },
        },
    },
    {
        files: ["**/build.ts", "**/tsc.ts"],

        extends: compat.extends(
            "eslint:recommended",
            "plugin:@typescript-eslint/recommended",
            "plugin:@typescript-eslint/recommended-requiring-type-checking"
        ),

        plugins: {
            "@typescript-eslint": typescriptEslint,
            import: fixupPluginRules(_import),
        },

        languageOptions: {
            parser: tsParser,
            ecmaVersion: 5,
            sourceType: "script",

            parserOptions: {
                project: ["./tsconfig.build.json"],
            },
        },

        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/prefer-ts-expect-error": "error",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-inferrable-types": "off",
            "@typescript-eslint/no-this-alias": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-unused-vars": "error",
            "@typescript-eslint/restrict-plus-operands": "off",
            "import/consistent-type-specifier-style": ["error", "prefer-top-level"],

            "import/order": [
                "error",
                {
                    groups: ["builtin", "external", "internal", "object", ["parent", "sibling"], "index", "type"],

                    pathGroups: [
                        {
                            pattern: "[!/]",
                            group: "type",
                            position: "before",
                        },
                        {
                            pattern: "../src/*",
                            group: "type",
                            position: "before",
                        },
                        {
                            pattern: "../types/*",
                            group: "type",
                            position: "after",
                        },
                    ],

                    distinctGroup: false,

                    alphabetize: {
                        order: "asc",
                    },

                    "newlines-between": "always-and-inside-groups",
                },
            ],
        },
    },
    {
        files: ["test/**/*.ts"],

        languageOptions: {
            ecmaVersion: 5,
            sourceType: "script",

            parserOptions: {
                project: ["./tsconfig.test.json"],
            },
        },

        settings: {
            "import/resolver": {
                typescript: {
                    alwaysTryTypes: true,
                    project: "./tsconfig.test.json",
                },

                alias: {
                    map: [["@dist", "./dist/src/index"]],
                    extentions: ["*.ts", "*.js"],
                },
            },
        },
    },
]);
