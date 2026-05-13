import esbuild from "esbuild";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const lib0Root = path.dirname(require.resolve("lib0/package.json"));
const lib0WebcryptoBrowserEntry = path.join(lib0Root, "webcrypto.js");
const watch = process.argv.includes("--watch");

/** Une seule résolution physique pour yjs / lib0 évite plusieurs copies dans le bundle (cf. https://github.com/yjs/yjs/issues/438). */
const ySingletonPlugin = {
  name: "markpad-y-singleton",
  setup(build) {
    build.onResolve({ filter: /^yjs$/ }, () => ({ path: require.resolve("yjs") }));
    build.onResolve({ filter: /^lib0$/ }, () => ({ path: require.resolve("lib0") }));
    // Force la version navigateur sur Obsidian mobile (sinon lib0 peut prendre webcrypto.node.js).
    build.onResolve({ filter: /^lib0\/webcrypto(\.js)?$/ }, () => ({
      path: lib0WebcryptoBrowserEntry
    }));
    build.onResolve({ filter: /^lib0\/webcrypto\.node(\.js)?$/ }, () => ({
      path: lib0WebcryptoBrowserEntry
    }));
  }
};

const context = await esbuild.context({
  entryPoints: ["src/main.ts"],
  bundle: true,
  format: "cjs",
  platform: "browser",
  target: "es2022",
  mainFields: ["browser", "module", "main"],
  conditions: ["browser", "default"],
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
