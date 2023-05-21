import siteConfig from "../../docusaurus.config"

const BLOG_PLUGIN = '@docusaurus/plugin-content-blog'
const RELEASE_PLUGIN_ID = 'releases'

export const releaseRoot = getReleaseRoot()

function getReleaseRoot(): string {
  if (!siteConfig.plugins) {
    throw new Error(`Docusaurus ${RELEASE_PLUGIN_ID} directory not set up`)
  }

  // Releases utilise the official 'content-blog' plugin
  const plugin = siteConfig.plugins.find(elem => elem[0] === BLOG_PLUGIN && elem[1].id === RELEASE_PLUGIN_ID)
  if (!plugin) {
    throw new Error(`Missing ${RELEASE_PLUGIN_ID} plugin`)
  }

  return plugin[1].id
}
