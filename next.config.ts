import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  webpack(config, { webpack }) {
    // The production Sites build resolves the native Cloudflare Workers module.
    // Vercel's Node runtime cannot resolve the `cloudflare:` URL scheme, so its
    // build receives a harmless stub. Public marketplace pages do not use D1;
    // authenticated workspace routes continue to live on the Sites deployment.
    if (process.env.VERCEL) {
      const cloudflareShim = path.join(
        projectRoot,
        "vercel/cloudflare-workers-shim.ts",
      );
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^cloudflare:workers$/,
          cloudflareShim,
        ),
      );
    }
    return config;
  },
};

export default nextConfig;
