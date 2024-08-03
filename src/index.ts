import RestProxy, { IProxySettings } from "sp-rest-proxy/dist/RestProxy";
import portfinder from "portfinder";
import { UserConfig, ProxyOptions } from "vite";

export class RollupPluginSPRestProxy {
  private settings: IProxySettings;
  private serve: RestProxy;

  constructor(settings: IProxySettings = { port: 9090, hostname: "localhost" }) {
    this.settings = settings;
    this.serve = new RestProxy(this.settings);
  }

  viteProxySetting(proxy?: Record<string, string | ProxyOptions> | undefined) {
    const targetBase = `http://${this.settings.hostname}:${this.settings.port}`;
    return {
      ...(proxy ?? {}),
      "^/.*_api": {
        target: targetBase,
        changeOrigin: true,
        secure: false,
      },
    };
  }

  rollupPlugin() {
    let server = this.serve;
    let settings = this.settings;
    return {
      name: "rollup-plugin-sp-rest-proxy",
      buildStart() {
        portfinder
          .getPortPromise({
            port: settings.port,
            stopPort: settings.port,
          })
          .then((port) => {
            server.serve();
          })
          .catch((err) => {
            console.log(
              `${err.message},if sp-rest-proxy already running, please ignore this message, otherwise you should change other port to proxy`
            );
          });
      },
    };
  }

  static mergeViteConfig(
    config: UserConfig,
    option?: {
      proxy?: Record<string, string | ProxyOptions> | undefined;
      setting?: IProxySettings;
    }
  ) {
    let rollupPluginSPRestProxy = new RollupPluginSPRestProxy(option?.setting);
    let proxy = rollupPluginSPRestProxy.viteProxySetting(option?.proxy);
    config.plugins?.push(rollupPluginSPRestProxy.rollupPlugin());
    if (!config.server) {
      config.server = {
        proxy,
      };
    } else if (!config.server?.proxy) {
      config.server.proxy = proxy;
    } else {
      if (config.server?.proxy?.["/_api"]) {
        console.warn(
          "/_api proxy already exists,rollup-plugin-sp-rest-proxy will override this proxy setting"
        );
      }
      config.server.proxy = {
        ...config.server.proxy,
        ...proxy,
      };
    }
    return config;
  }
}
export default RollupPluginSPRestProxy;
