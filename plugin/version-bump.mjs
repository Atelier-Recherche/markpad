/**
 * Synchronise manifest.json et versions.json avec process.env.npm_package_version
 * (défini par Release-Plugin.ps1 avant l'appel à ce script).
 */
import { readFileSync, writeFileSync } from "node:fs";

const targetVersion = process.env.npm_package_version;
if (!targetVersion || String(targetVersion).trim() === "") {
  console.error("npm_package_version est vide. Lancez via Release-Plugin.ps1 ou exportez npm_package_version.");
  process.exit(1);
}

const manifestPath = "manifest.json";
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const { minAppVersion } = manifest;
if (!minAppVersion) {
  console.error(`${manifestPath} : minAppVersion manquant.`);
  process.exit(1);
}

manifest.version = targetVersion;
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");

const versionsPath = "versions.json";
let versions = {};
try {
  versions = JSON.parse(readFileSync(versionsPath, "utf8"));
} catch {
  console.warn(`${versionsPath} absent ou invalide, recréation.`);
}
versions[targetVersion] = minAppVersion;
writeFileSync(versionsPath, JSON.stringify(versions, null, 2) + "\n", "utf8");

console.log(`version-bump: ${targetVersion} (minAppVersion ${minAppVersion})`);
