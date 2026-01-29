# rollup-plugin-sp-rest-proxy

[Rollup](https://rollupjs.org) / [Vite](https://vitejs.dev) plugin that wires
[sp-rest-proxy](https://github.com/koltyakov/sp-rest-proxy) into the dev server
so SharePoint REST calls resolve locally while you build.

## Compatibility

- Built and tested against **Vite 7.x** (Rollup 4.x, Node 18+).
- Use **`rollup-plugin-sp-rest-proxy@^2`** for Vite 5–7 projects.
- If you are pinned to **Vite 4 or earlier**, install
  **`rollup-plugin-sp-rest-proxy@^1`**, which keeps the old default export.

## Install

```bash
npm install -D rollup-plugin-sp-rest-proxy
# or
pnpm add -D rollup-plugin-sp-rest-proxy
```

## Usage

```javascript
import { defineConfig } from "vite";
import { RollupPluginSPRestProxy } from "rollup-plugin-sp-rest-proxy";

const rollupPluginSPRestProxy = new RollupPluginSPRestProxy();

export default defineConfig({
  server: {
    proxy: {
      ...rollupPluginSPRestProxy.viteProxySetting(),
    },
  },
  plugins: [rollupPluginSPRestProxy.rollupPlugin()],
});
```

```javascript
import { defineConfig } from "vite";
import { RollupPluginSPRestProxy } from "rollup-plugin-sp-rest-proxy";

export default defineConfig(
  RollupPluginSPRestProxy.mergeViteConfig({
    /* your vite config */
  })
);
```

### Options

- The constructor accepts the underlying `sp-rest-proxy` settings; defaults are
  `{ port: 9090, hostname: "localhost" }`.
- `viteProxySetting` merges the SharePoint `_api` proxy into any existing Vite
  proxy map while preserving your other entries.

### Notes

- v2 switches to **named exports only**; update imports accordingly.
- Dependencies are bumped to `sp-rest-proxy@^3.3.6`, `portfinder@^1.0.28`, and
  Vite 7.x to stay current with upstream fixes.
