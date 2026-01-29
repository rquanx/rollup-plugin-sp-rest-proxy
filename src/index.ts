import type { IProxySettings } from 'sp-rest-proxy/dist/RestProxy'
import { ProxyOptions, UserConfig } from 'vite'

const wait = (ms: number, execute: () => void) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      try {
        execute()
        resolve(true)
      } catch (err) {
        reject(err)
      }
    }, ms),
  )

export class RollupPluginSPRestProxy {
  private settings: IProxySettings

  constructor(settings: IProxySettings = { port: 9090, hostname: 'localhost' }) {
    this.settings = settings
  }
  viteProxySetting(proxy?: Record<string, string | ProxyOptions> | undefined) {
    const targetBase = `http://${this.settings.hostname}:${this.settings.port}`
    return {
      ...(proxy ?? {}),
      '^/.*_api': {
        target: targetBase,
        changeOrigin: true,
        secure: false,
      },
    }
  }

  rollupPlugin() {
    let settings = this.settings
    return {
      name: 'rollup-plugin-sp-rest-proxy',
      async configureServer() {
        const RestProxy = await import('sp-rest-proxy/dist/RestProxy')
        const { default: portfinder } = await import('portfinder')
        // @ts-ignore
        const server = new RestProxy.default.default(settings)
        portfinder
          .getPortPromise({
            port: settings.port,
            stopPort: settings.port,
          })
          .then(async () => {
            // 第一次需要输入信息，做下延迟避免被 vite 挤掉，未覆盖所有场景
            await wait(500, () => {
              server.serve()
            })
          })
          .catch((err) => {
            console.log(`${err.message}, if sp-rest-proxy already running, ignore this message`)
          })
      },
    }
  }

  static mergeViteConfig(
    config: UserConfig,
    option?: {
      proxy?: Record<string, string | ProxyOptions> | undefined
      setting?: IProxySettings
    },
  ) {
    let rollupPluginSPRestProxy = new RollupPluginSPRestProxy(option?.setting)
    let proxy = rollupPluginSPRestProxy.viteProxySetting(option?.proxy)
    config.plugins?.push(rollupPluginSPRestProxy.rollupPlugin())
    if (!config.server) {
      config.server = {
        proxy,
      }
    } else if (!config.server?.proxy) {
      config.server.proxy = proxy
    } else {
      if (config.server?.proxy?.['^/.*_api']) {
        console.warn('^/.*_api proxy already exists,rollup-plugin-sp-rest-proxy will override this proxy setting')
      }
      config.server.proxy = {
        ...config.server.proxy,
        ...proxy,
      }
    }
    return config
  }
}
