import esbuild from "esbuild";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const watch = process.argv.includes("--watch");

/** Une seule résolution physique pour yjs / lib0 évite plusieurs copies dans le bundle (cf. https://github.com/yjs/yjs/issues/438). */
const ySingletonPlugin = {
  name: "markpad-y-singleton",
  setup(build) {
    build.onResolve({ filter: /^yjs$/ }, () => ({ path: require.resolve("yjs") }));
    build.onResolve({ filter: /^lib0$/ }, () => ({ path: require.resolve("lib0") }));
  }
};

const context = await esbuild.context({
  entryPoints: ["src/main.ts"],
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "es2022",
  sourcemap: watch ? "inline" : false,
  outfile: "main.js",
  external: ["obsidian", "electron", "@codemirror/state", "@codemirror/view"],
  plugins: [ySingletonPlugin]
});

if (watch) {
  await context.watch();
  console.log("Watching plugin build...");
} else {
  await context.rebuild();
  await context.dispose();
}
