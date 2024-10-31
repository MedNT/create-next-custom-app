import fs from 'fs';
import { getPackageDotJson, putPackageDotJson } from '../helpers/hooks.js';

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
        `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no-install commitlint --edit "$1"`,
        { mode: 0o755, encoding: 'utf8' }
    );

    // Create pre-commit hook for lint-staged
    const preCommitHookPath = path.join(huskyDir, 'pre-commit');
    fs.writeFileSync(
        preCommitHookPath,
        `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged`,
        { mode: 0o755, encoding: 'utf8' }
    );

    console.log(chalk.green('Husky and Git hooks set up successfully!'));
}

export async function huskyandCommitlintConfig(packageName, projectName) {
    console.log(
        chalk.blue(
            `${figures.triangleRight} Configuring ${packageName}...`
        )
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