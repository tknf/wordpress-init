import * as path from "path";
import { execSync } from "child_process";
import * as fse from "fs-extra";
import sortPackageJson from "sort-package-json";

import cliPackageJson from "./package.json";

export type Environment = "docker" | "lamp";

export type FrontendLang = "ts" | "js";

export type CreateAppArgs = {
  projectDir: string;
  environment: Environment;
  frontendLang: FrontendLang;
  install: boolean;
  quiet?: boolean;
};

async function createApp({ projectDir, environment, frontendLang, install, quiet }: CreateAppArgs) {
  const versions = process.versions;
  if (versions?.node && parseInt(versions.node) < 14) {
    console.log(`Oops, Node v${versions.node} detected. Wordpress Int requires a node version greater than 14.`);
    process.exit(1);
  }

  const relativeProjectDir = path.resolve(process.cwd(), projectDir);
  const projectDirIsCurrentDir = relativeProjectDir === "";
  if (!projectDirIsCurrentDir) {
    if (fse.existsSync(projectDir)) {
      console.log(`Oops, "${relativeProjectDir}" already exists. Please try again with a different directory.`);
      process.exit(1);
    } else {
      await fse.mkdirp(projectDir);
    }
  }

  // copy template
  let themePath = "";
  if (environment === "docker") {
    themePath = `wp`;
  } else if (environment === "lamp") {
    themePath = `wp-content/themes/wp`;
  }

  const sharedTemplate = path.resolve(__dirname, "templates", `_shared`);
  await fse.copy(sharedTemplate, `${projectDir}/${themePath}`);

  const envTemplate = path.resolve(__dirname, "templates", `_env_${environment}`);
  if (fse.existsSync(envTemplate)) {
    await fse.copy(envTemplate, projectDir, { overwrite: true });
  }

  const frontendSharedTemplate = path.resolve(__dirname, "templates", `_frontend_${frontendLang}`);
  if (fse.existsSync(frontendSharedTemplate)) {
    await fse.copy(frontendSharedTemplate, `${projectDir}/${themePath}`, { overwrite: true });
  }

  // rename dotfiles
  const dotfiles = ["gitignore", "github", "dockerignore", "env.example"];
  await Promise.all(
    dotfiles.map(async (dotfile) => {
      if (fse.existsSync(path.join(projectDir, dotfile))) {
        return fse.rename(path.join(projectDir, dotfile), path.join(projectDir, `.${dotfile}`));
      }
    })
  );

  // merge package.jsons
  let appPkg = require(path.join(frontendSharedTemplate, "package.json"));
  appPkg.scripts = appPkg.scripts || {};
  appPkg.dependencies = appPkg.dependencies || {};
  appPkg.devDependencies = appPkg.devDependencies || {};

  // add current versions of package deps
  ["dependencies", "devDependencies"].forEach((pkgKey) => {
    for (const key in appPkg[pkgKey]) {
      if (appPkg[pkgKey][key] === "*") {
        appPkg[pkgKey][key] = String(cliPackageJson.version).includes("-")
          ? cliPackageJson.version
          : "^" + cliPackageJson.version;
      }
    }
  });

  appPkg = sortPackageJson(appPkg);

  // write package.json
  await fse.writeFile(path.join(projectDir, "package.json"), JSON.stringify(appPkg, null, 2));

  if (install) {
    execSync("npm install", { stdio: "inherit", cwd: projectDir });
  }

  if (!quiet) {
    if (projectDirIsCurrentDir) {
      console.log(`Check the README for development.`);
    } else {
      console.log(`\`cd\` into "${path.relative(process.cwd(), projectDir)}" and check the README for development.`);
    }
  }
}

export { createApp };
