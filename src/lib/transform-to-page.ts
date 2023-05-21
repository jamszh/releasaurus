import { stringify } from "yaml"

interface GithubRelease {
  html_url: string;
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  }
  published_at: string;
  body?: string;
}

function metadataClosure(content: string): string {
  return ['---', content, '---\n'].join('\n')
}

function buildMetadata(release: GithubRelease, releaseName: string, repo: string): string {
  const obj = {
    title: releaseName,
    date: release.published_at,
    tags: [repo],
    authors: {
      name: release.author.login,
      url: release.author.html_url,
      image_url: release.author.avatar_url,
    }
  }
  return metadataClosure(stringify(obj))
}

export function toPage(release: GithubRelease, releaseName: string, repo: string): string {
  return `${buildMetadata(release, releaseName, repo)}${release?.body ?? ''}`
}
