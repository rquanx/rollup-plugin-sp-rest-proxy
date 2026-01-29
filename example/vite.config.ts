import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { RollupPluginSPRestProxy } from 'rollup-plugin-sp-rest-proxy'
const rollupPluginSPRestProxy = new RollupPluginSPRestProxy()

// https://vite.dev/config/
export default defineConfig(async () => {
  return {
    server: {
      proxy: {
        ...rollupPluginSPRestProxy.viteProxySetting(),
      },
    },
    plugins: [react(), rollupPluginSPRestProxy.rollupPlugin()],
  }
})
