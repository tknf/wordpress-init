#! /usr/bin/env node

import * as path from "path";
import * as chalk from "chalk";
import * as inquirer from "inquirer";
import meow from "meow";

import type { Environment, FrontendLang } from "./index";
import { createApp } from "./index";

const help = `
    Usage:
      $ npx @tknf/wordpress-init [flags...] [<dir>]

    If <dir> is not provided up front you will be prompted for it.

    Flags:
      --help, -h           Show this help message
      --version, -v        Show the version of this script
`;

run().then(
  () => {
    process.exit(0);
  },
  (err) => {
    console.error(err);
    process.exit(1);
  }
);

async function run() {
  const { input, flags, showHelp, showVersion, pkg } = meow(help, {
    flags: {
      help: { type: "boolean", default: false, alias: "h" },
      version: { type: "boolean", default: false, alias: "v" }
    }
  });

  if (flags.help) {
    showHelp();
  }
  if (flags.version) {
    showVersion();
  }

  console.log(chalk.green(`\nWordpress Init - v${pkg.version}`));
  console.log();

  console.log(`Let's get you set up with a new project.`);
  console.log();

  const projectDir = path.resolve(
    process.cwd(),
    input.length > 0
      ? input[0]
      : (
          await inquirer.prompt<{ dir: string }>({
            type: "input",
            name: "dir",
            message: `Where would you like to create your environment?`,
            default: `./my-project`
          })
        ).dir
  );

  const answers = await inquirer.prompt<{
    environment: Environment;
    frontendLang: FrontendLang;
    install: boolean;
  }>([
    {
      name: "environment",
      type: "list",
      message: `What type of wordpress exec environment to create?`,
      choices: [
        { name: `Docker`, value: "docker" },
        { name: `LAMP Stack`, value: "lamp" }
      ]
    },
    {
      name: "frontendLang",
      type: "list",
      message: `Which type of frontend language?`,
      choices: [
        { name: `TypeScript`, value: "ts" },
        { name: `JavaScript`, value: "js" }
      ]
    },
    {
      name: "install",
      type: "confirm",
      message: `Do you want me to run \`npm install\`?`,
      default: true
    }
  ]);

  await createApp({
    projectDir,
    environment: answers.environment,
    frontendLang: answers.frontendLang,
    install: answers.install
  });
}
