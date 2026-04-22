import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { minify } from "terser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const packageJsonPath = path.join(rootDir, "package.json");
const sourcePath = path.join(rootDir, "mixtape-player.js");
const distDir = path.join(rootDir, "dist");
const distSourcePath = path.join(distDir, "mixtape-player.js");
const distMinPath = path.join(distDir, "mixtape-player.min.js");

const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
const source = await readFile(sourcePath, "utf8");

const banner = `/*!
 * ${packageJson.name} v${packageJson.version}
 * ${packageJson.description}
 * ${packageJson.homepage}
 * Released under the ${packageJson.license} License.
 */
`;

await mkdir(distDir, { recursive: true });
await writeFile(distSourcePath, `${banner}\n${source}`);

const minified = await minify(source, {
  compress: {
    passes: 2,
  },
  mangle: true,
  format: {
    comments: /^!/,
  },
});

if (!minified.code) {
  throw new Error("Terser did not return output.");
}

await writeFile(distMinPath, `${banner}${minified.code}\n`);

console.log(`Built ${path.relative(rootDir, distSourcePath)}`);
console.log(`Built ${path.relative(rootDir, distMinPath)}`);
