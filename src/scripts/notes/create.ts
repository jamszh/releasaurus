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
  owner: string;
  path: string;
  repo: string;
  auth: string;
  _: string[];
  $0: string;
}

const options: Omit<Arguments, '$0' | '_'> = {
  t: { type: 'string', describe: "specify release tag", alias: 'tag', default: 'latest' },
  o: { type: 'string', describe: "Github repository owner", alias: 'owner', demandOption: true },
  r: { type: 'string', describe: "Github repository name", alias: 'repo', demandOption: true },
  p: { type: 'string', describe: "Release notes path", alias: 'path', demandOption: true },
  a: { type: 'string', describe: "Github authentication token", alias: 'auth', demandOption: true },
}

const examples: [string, string][] = [
  [`$0 -a your-auth-token -o jamszh -r releasaurus -p ${releaseRoot}`, 'Create notes page for the latest release (single project)'],
  [`$0 -a your-auth-token -o jamszh -r releasaurus -p ${releaseRoot}/dino-lib`, 'Create notes page for the latest release of "dino-lib"'],
  [`$0 -a your-auth-token -o jamszh -r releasaurus -p ${releaseRoot}/dino-lib -v "1.0.0"`, 'Create notes page for v1.0.0'],
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
  return true
}

async function handler(argv: Arguments) {
  const github = init({ token: argv.auth })
  const release = await github.getRelease(argv.owner, argv.repo)

  if (!release) {
    process.exit(0)
  }

  const releaseName = `${release.tag_name}-${argv.repo}`
  const pageContent = toPage(release, releaseName, argv.repo)
  savePage(pageContent, argv.path, releaseName)
}
