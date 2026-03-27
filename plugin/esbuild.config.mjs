import esbuild from "esbuild";

const watch = process.argv.includes("--watch");

const context = await esbuild.context({
  entryPoints: ["src/main.ts"],
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "es2022",
  sourcemap: watch ? "inline" : false,
  outfile: "main.js",
  external: ["obsidian", "electron", "@codemirror/state", "@codemirror/view"]
});

if (watch) {
  await context.watch();
  console.log("Watching plugin build...");
} else {
  await context.rebuild();
  await context.dispose();
}
