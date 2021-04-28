# rollup-plugin-sp-rest-proxy

[Rollup](https://rollupjs.org) plugin for proxy SharePoint request in vite.
Inspired by [sp-rest-proxy](https://github.com/koltyakov/sp-rest-proxy).

## Usage

```javascript
import { defineConfig } from "vite";
import RollupPluginSPRestProxy from "rollup-plugin-sp-rest-proxy";
let rollupPluginSPRestProxy = new RollupPluginSPRestProxy();

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
import RollupPluginSPRestProxy from "rollup-plugin-sp-rest-proxy";
let rollupPluginSPRestProxy = new RollupPluginSPRestProxy();

export default defineConfig(
  RollupPluginSPRestProxy.mergeViteConfig({
    /* self vite config */
  })
);
```
