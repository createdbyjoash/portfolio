const isGithubPages = process.env.GITHUB_PAGES === 'true'
// Project pages are served at https://<org>.github.io/<repo>/ — adjust this if the
// repo is ever renamed or moved to a user/org root page (<org>.github.io).
const repoBasePath = '/portfolio'

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  ...(isGithubPages && {
    output: 'export',
    basePath: repoBasePath,
    assetPrefix: repoBasePath,
  }),
}

export default nextConfig