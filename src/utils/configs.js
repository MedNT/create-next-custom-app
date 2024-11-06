import fs from 'fs';
import { getPackageDotJson, putPackageDotJson } from '../helpers/hooks.js';
import chalk from 'chalk';
import figures from 'figures';
import { execa } from 'execa';
import path from 'path';
import {
  findLayoutFilePath,
  getProjectFileExtension,
  updateNextConfig,
  wrapWithProvider,
} from './advanced-configs/chakraui.js';

export async function commitlintConfig(packageName, projectName) {
  console.log(
    chalk.blue(`${figures.triangleRight} Configuring ${packageName}...`)
  );
  // installing conventional commits config
  console.log(chalk.green(`Installing @commitlint/config-conventional...`));
  await execa('npm', ['install', '-D', '@commitlint/config-conventional'], {
    stdio: 'inherit',
    cwd: projectName,
  });
  // setting up the config into the project
  fs.writeFileSync(
    `${projectName}/commitlint.config.js`,
    `module.exports = { extends: ["@commitlint/config-conventional"] };`
  );
}

export async function prettierConfig(packageName, projectName) {
  console.log(
    chalk.blue(
      `${figures.triangleRight}Configuring ${packageName} with default values...`
    )
  );
  fs.writeFileSync(
    `${projectName}/.prettierrc.json`,
    `{ "semi": true, \n"singleQuote": true, \n"tabWidth": 4, \n"trailingComma": "es5", \n"printWidth": 80}`
  );
  // editing the package.json file
  const { packageJson, packageJsonPath } = getPackageDotJson(projectName);
  // adding lint-staged property
  packageJson.scripts = {
    ...packageJson.scripts,
    format: 'prettier --write .',
  };
  // write on packages.json file
  putPackageDotJson(packageJson, packageJsonPath);
}

export async function huskyConfig(packageName, projectName) {
  console.log(
    chalk.blue(
      `${figures.triangleRight} Configuring ${packageName} and Git hooks...`
    )
  );
  // Initialize Husky
  await execa('npx', ['husky', 'init'], {
    stdio: 'inherit',
    cwd: projectName,
  });
  // Ensure the `_` directory with `husky.sh` is created
  await execa('npx', ['husky', 'install'], {
    stdio: 'inherit',
    cwd: projectName,
  });

  // Path to the .husky directory
  const huskyDir = path.join(projectName, '.husky');

  // Create commit-msg hook for commitlint
  const commitMsgHookPath = path.join(huskyDir, 'commit-msg');
  fs.writeFileSync(
    commitMsgHookPath,
    `npx --no-install commitlint --edit "$1"`,
    { mode: 0o755, encoding: 'utf8' }
  );

  // Create pre-commit hook for lint-staged
  const preCommitHookPath = path.join(huskyDir, 'pre-commit');
  fs.writeFileSync(preCommitHookPath, `npx lint-staged`, {
    mode: 0o755,
    encoding: 'utf8',
  });

  console.log(chalk.green('Husky and Git hooks set up successfully!'));
}

export async function huskyandCommitlintConfig(packageName, projectName) {
  console.log(
    chalk.blue(`${figures.triangleRight} Configuring ${packageName}...`)
  );
  // editing the package.json file
  const { packageJson, packageJsonPath } = getPackageDotJson(projectName);
  // adding lint-staged property
  packageJson.husky = {
    hooks: {
      'commit-msg': 'npx --no-install commitlint --edit $1',
    },
  };
  // write on packages.json file
  putPackageDotJson(packageJson, packageJsonPath);
}

export async function lintstagedConfig(packageName, projectName) {
  console.log(
    chalk.blue(
      `${figures.triangleRight} Configuring ${packageName} and Git hooks...`
    )
  );
  // editing the package.json file
  const { packageJson, packageJsonPath } = getPackageDotJson(projectName);
  // adding lint-staged property
  packageJson['lint-staged'] = {
    '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
    '*css': ['stylelint --fix', 'prettier --write'],
  };
  // write on packages.json file
  putPackageDotJson(packageJson, packageJsonPath);
}

export async function reactqueryConfig(packageName, projectName) {
  // installing react-query plugin
  console.log(
    chalk.green(`Installing ${packageName} ESLint Plugin (recommended)...`)
  );
  await execa('npm', ['install', '-D', '@tanstack/eslint-plugin-query'], {
    stdio: 'inherit',
    cwd: projectName,
  });
}

export async function storybookConfig(packageName, projectName) {
  console.log(
    chalk.green(
      `Installing & Configuring ${packageName} (this might take a while)...`
    )
  );
  await execa('npx', ['storybook@latest', 'init'], {
    stdio: 'inherit',
    cwd: projectName,
  });
}

export async function shadcnuiConfig(packageName, projectName) {
  console.log(chalk.green(`Installing & Configuring ${packageName}...`));
  await execa('npx', ['shadcn@latest', 'init', '-d'], {
    stdio: 'inherit',
    cwd: projectName,
  });
}

export async function daisyuiConfig(packageName, projectName) {
  console.log(chalk.green(`Installing & Configuring ${packageName}...`));
  await execa('npm', ['install', '-D', 'daisyui@latest'], {
    stdio: 'inherit',
    cwd: projectName,
  });

  // root directory access
  // eslint-disable-next-line no-undef
  const rootDir = path.join(process.cwd(), projectName);
  // getting the project extention
  const projectExtention = getProjectFileExtension(rootDir);
  // getting the tailwind.config.js Path
  const filePath = path.join(
    rootDir,
    '.',
    `tailwind.config.${projectExtention}`
  );

  // read file
  fs.readFile(filePath, 'utf8', (err, data) => {
    // if file not found or error while reading
    if (err) {
      console.error(`Error reading file: ${err}`);
      return;
    }

    // Check if daisyui is not already required in the plugins array
    if (!data.includes("require('daisyui')")) {
      // Insert require('daisyui') into the plugins array
      const updatedData = data.replace(
        /plugins:\s*\[([^\]]*)\]/,
        (match, pluginsContent) => {
          // If pluginsContent is empty, just add daisyui, else add a comma
          const separator = pluginsContent.trim() ? ', ' : '';
          return `plugins: [${pluginsContent}${separator}require('daisyui')]`;
        }
      );

      // Write the modified content back to the file
      fs.writeFile(filePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error(`Error writing file: ${err}`);
        } else {
          console.log(
            chalk.green(
              `daisyui successfully added to the plugins array in tailwind.config.${projectExtention}`
            )
          );
        }
      });
    }
  });
}

export async function chakrauiConfig(packageName, projectName) {
  console.log(
    chalk.green(
      `Installing & Configuring ${packageName} (this may take sometime)...`
    )
  );
  await execa('npm', ['i', '@chakra-ui/react'], {
    stdio: 'inherit',
    cwd: projectName,
  });
  await execa('npm', ['i', '@emotion/react'], {
    stdio: 'inherit',
    cwd: projectName,
  });
  // adding a snippet for provider & color-mode (required)
  // used to wrap the root layour children
  await execa('npx', ['@chakra-ui/cli', 'snippet', 'add', 'provider'], {
    stdio: 'inherit',
    cwd: projectName,
  });

  /**
   * Wrapping the layout.(ts|js) file with the Provider
   * e.g: <Provider>{children}</Provider>
   */

  // getting the project root Path
  // eslint-disable-next-line no-undef
  const rootDir = path.join(process.cwd(), projectName);
  // searching for the layout file path
  const layoutFilePath = findLayoutFilePath(rootDir);

  // if layout file not found, print error message
  if (!layoutFilePath) {
    console.log(
      chalk.green(
        `Could not locate the layout file. Please wrap your application with <Provider>{children}</Provider> manually!`
      )
    );
  } else {
    wrapWithProvider(layoutFilePath);
  }

  /**
   * Optimizing Bundle Step
   * by adding:
   * {@code} experimental: {
   *    optimizePackageImports: ["@chakra-ui/react"],
   *
   * to the next.config.mjs file
   */
  updateNextConfig(rootDir);
}
