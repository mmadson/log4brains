import commander from "commander";
import type { AppConsole } from "@madm4ttus3r/l4bcli-common";
import { createInitCli } from "@madm4ttus3r/l4binit";
import { createCli } from "@madm4ttus3r/l4bcli";
import { createWebCli } from "@madm4ttus3r/l4bweb";

type Deps = {
  appConsole: AppConsole;
  version: string;
};

export function createGlobalCli({
  appConsole,
  version
}: Deps): commander.Command {
  const program = new commander.Command();
  program
    .version(version)
    .description(
      "Log4brains CLI to preview and build your architecture knowledge base.\n" +
        "You can also manage your ADRs from here (see `log4brains adr --help`).\n\n" +
        "All the commands should be run from your project's root folder.\n\n" +
        "Add the `--help` option to any command to see its detailed documentation."
    );

  const initCli = createInitCli({ appConsole });
  const cli = createCli({ appConsole });
  const webCli = createWebCli({ appConsole });

  [...initCli.commands, ...cli.commands, ...webCli.commands].forEach((cmd) => {
    program.addCommand(cmd);
  });

  return program;
}
