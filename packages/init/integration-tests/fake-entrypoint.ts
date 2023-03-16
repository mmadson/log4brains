import { AppConsole } from "@madm4ttus3r/l4bcli-common";
import { createInitCli } from "../src/cli";

const cli = createInitCli({
  appConsole: new AppConsole({ debug: false, traces: false })
});
cli.parse(process.argv);
