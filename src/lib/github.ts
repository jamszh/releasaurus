import { Octokit } from "@octokit/rest";

export interface GithubConfig {
  token: string;
}

async function fetchReleases(
  client: Octokit,
  owner: string,
  repo: string,
) {
  try {
    const response = await client.repos.listReleases({ owner, repo })
    return response.data
  } catch (error) {
    throw new Error(`Error fetching release for ${owner}/${repo}.`)
  }
}

async function getRelease(
  client: Octokit,
  owner: string,
  repo: string,
  version?: string,
) {
  const data = await fetchReleases(client, owner, repo)
  if (data.length === 0) {
    console.error(`No releases found for repository: ${owner}/${repo}.`)
    return null
  }
  if (version) {
    const versionedRelease = data.find(release => release.tag_name === version)
    if (!versionedRelease) {
      console.error(`Unable to find version ${version} for ${owner}/${repo}.`)
      return null
    }
    return versionedRelease;
  }
  return data[0]
}

export const init = (config: GithubConfig) => {
  const client = new Octokit({ auth: config.token })
  return {
    getRelease: (owner: string, repo: string, version?: string) => {
      return getRelease(client, owner, repo, version)
    }
  }
}
