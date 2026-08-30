import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import globals from "globals";
import vueParser from "vue-eslint-parser"
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
    globalIgnores(["**/dist/**", "**/coverage/**"]),

    js.configs.recommended,

    ...vue.configs["flat/recommended"],

    {
        files: ["**/*.vue"],
        languageOptions: {
            parser: vueParser,
        },
        rules: {
            "vue/multi-word-component-names": "off",
        },
    },

    {
        files: ["src/**/*.{js,vue}"],
        languageOptions: {
            globals: globals.browser,
        },
    },

    {
        files: ["*.config.js", "eslint.config.js"],
        languageOptions: {
            globals: globals.node,
        },
    },

    {
        rules: {
            "no-console": "off",
        },
    },
    eslintPluginPrettierRecommended,
]);
