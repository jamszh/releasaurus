import { savePage } from "../../lib/save-page";
import { toPage } from "../../lib/transform-to-page";
import { Argv } from "yargs";
import { init } from "../../lib/github";
import { releaseRoot } from "../../lib/release-config";

const yargCommand = {
  command: 'create',
  describe: 'release notes page',
  builder,
  handler,
}
export default yargCommand

type Arguments = {
  [x: string]: unknown;
  tag: string;
  path: string;
  repo: string;
  auth: string;
  _: string[];
  $0: string;
}

const options: Omit<Arguments, '$0' | '_'> = {
  t: { type: 'string', describe: "specify release tag", alias: 'tag', default: 'latest' },
  r: { type: 'string', describe: "full Github repository name", alias: 'repo', demandOption: true },
  p: { type: 'string', describe: "Release notes path", alias: 'path', default: releaseRoot },
  a: { type: 'string', describe: "Github authentication token", alias: 'auth', demandOption: true },
}

const examples: [string, string][] = [
  [`$0 -a your-auth-token -r lux-group/lib-logger`, 'Create notes page for the latest release (single project)'],
  [`$0 -a your-auth-token -r lux-group/lib-logger -p ${releaseRoot}/lib-logger`, 'Create notes page for the latest release of "lib-logger"'],
  [`$0 -a your-auth-token -r lux-group/lib-logger -p ${releaseRoot}/lib-logger -v "1.0.0"`, 'Create notes page for v1.0.0'],
]

function builder(yargs: Argv) {
  return yargs
    .options(options)
    .check(check)
    .usage('$0 [args]')
    .example(examples)
    .help()
}

function check(argv: Arguments) {
  if (argv.path === releaseRoot) {
    return true
  }

  const pathSplits = argv.path.split('/')
  if (pathSplits[0] !== releaseRoot) {
    throw new Error("Invalid releasaurus path")
  }

  const repoSplits = argv.repo.split('/')
  if (repoSplits.length !== 2) {
    throw new Error(`Invalid repository name ${argv.repo}`)
  }

  return true
}

async function handler(argv: Arguments) {
  const github = init({ token: argv.auth })

  const [owner, repoName] = argv.repo.split('/')
  const release = await github.getRelease(owner, repoName, argv.tag)

  if (!release) {
    process.exit(0)
  }

  const releaseName = `${release.tag_name}-${repoName}`
  const pageContent = toPage(release, releaseName, repoName)
  savePage(pageContent, argv.path, releaseName)
}
