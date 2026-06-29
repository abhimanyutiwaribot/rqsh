import esbuild from "esbuild";

esbuild.build({
  entryPoints: ["src/index.tsx"],
  bundle: true,
  minify: true,
  platform: "node",
  format: "esm",
  outfile: "dist/index.js",
  external: ["clipboardy"],
  alias: {
    "react-devtools-core": "./src/utils/mockDevtools.ts",
  },
  banner: {
    js: `#!/usr/bin/env node
import { createRequire } from 'module';
const require = createRequire(import.meta.url);`,
  },
}).catch(() => process.exit(1));
