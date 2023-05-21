import yargs from "yargs"
import { hideBin } from 'yargs/helpers'
import create from './create'

yargs(hideBin(process.argv))
  .command(create)
  .demandCommand(1, "Please provide a command")
  .wrap(yargs.terminalWidth())
  .scriptName("notes-please")
  .help()
  .argv
