import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Gera tambem dist/standalone: bundle Node autocontido usado pelo Dockerfile.
  // Nao afeta dist/client e dist/server (caminho Cloudflare Workers).
  output: 'standalone',
};

export default nextConfig;
