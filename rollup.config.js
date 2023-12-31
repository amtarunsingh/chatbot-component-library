import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";
import postcss from "rollup-plugin-postcss";
import packageJson from "./package.json" assert { type: "json" };
import peerDepsExternal from "rollup-plugin-peer-deps-external";

export default [
  {
    input: "./src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap:  "inline"
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap:  "inline"
      }
    ],
    plugins: [
      resolve({
        browser: true,
        resolveOnly: [/^(?!stream|http|https|fs|zlib)/],
        fallback: {
          "stream": require.resolve("stream-browserify"),
          "http": require.resolve("stream-http"),
          "https": require.resolve("https-browserify"),
          "fs": false,
          "zlib": require.resolve("browserify-zlib")
        },
      }),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json", inlineSources: true}),
      json(),
      postcss(),
      peerDepsExternal(),
    ],
  },
  {
    input: "dist/esm/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts.default()],
    external: [/\.css$/],
  },
];