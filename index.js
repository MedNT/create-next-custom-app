#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import figures from 'figures';
import fs from 'fs';
import path from 'path';
import { execa } from 'execa';
import welcome from './helpers/welcome.js';
import { additionalPackagesChoices } from './utils/packages.js';
import { dependenciesType, nextJSVersionsChoices } from './utils/statics.js';

// Prompt user for inputs using a check box
async function checkBoxPromptForProjectDetails() {
    // Prompt user for inputs
    const {
        projectName,
        version,
        dependencies: selectedDependencies,
    } = await inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: 'Project name: ',
            default: 'my-next-custom-app',
        },
        {
            type: 'list',
            name: 'version',
            message: 'NextJS version: ',
            default: 'latest',
            choices: nextJSVersionsChoices,
        },
        {
            type: 'checkbox',
            name: 'dependencies',
            message: 'Select additional packages to install:',
            choices: additionalPackagesChoices,
        },
    ]);

    // Add `type` field to selected dependencies
    const dependenciesWithType = additionalPackagesChoices
        .filter((choice) => selectedDependencies.includes(choice.value))
        .map(({ name, value, type }) => ({ name, value, type }));

    return { projectName, version, selectedDependencies, dependenciesWithType };
}

// Create Next.js Custom app Main Function
async function createNextApp() {
    // additional dependencies selection using a check box
    const { projectName, version, selectedDependencies, dependenciesWithType } =
        await checkBoxPromptForProjectDetails();

    // Run npx create-next-app
    console.log(
        chalk.blue(
            `${figures.triangleRight} Creating your Custom Next.js project with CNCA "${projectName} version ${version}"...`
        )
    );

    // welcome message
    await welcome();


    // proceed with the creation of the nextjs app
    try {
        // creating nextjs app using the create-next-app utility
        await execa('npx', [`create-next-app@${version}`, projectName], {
            stdio: 'inherit',
        });
        // fetching developement dependencies
        const devDependencies = dependenciesWithType
            .filter((d) => d.type === dependenciesType.dev)
            .map((d) => d.value.trim());
        // fetching production dependencies
        const prodDependencies = dependenciesWithType
            .filter((d) => d.type === dependenciesType.prod)
            .map((d) => d.value.trim());
        // fetching dependencies that needs an init setup using npx (e.g. storybook)
        const initDependencies = dependenciesWithType
            .filter((d) => d.type === dependenciesType.init)
            .map((d) => d.value.trim());

        // Install selected dependencies
        if (selectedDependencies.length > 0) {
            console.log(
                chalk.bgGreen(
                    `${figures.triangleRight} Installing additional selected dependencies...`
                )
            );

            // production dependencies
            for (let i = 0; i < prodDependencies.length; i++) {
                console.log(
                    chalk.green(`Installing Production Dependency: ${prodDependencies[i]}...`)
                );
                await execa('npm', ['install', prodDependencies[i]], {
                    stdio: 'inherit',
                    cwd: projectName,
                });
            }
            // development dependencies
            for (let i = 0; i < devDependencies.length; i++) {
                console.log(chalk.green(`Installing Development Dependency: ${devDependencies[i]}...`));
                await execa('npm', ['install', '-D', devDependencies[i]], {
                    stdio: 'inherit',
                    cwd: projectName,
                });
            }
        }

        if (devDependencies.length > 0) {
            // Setting up commitlint
            if (selectedDependencies.includes('@commitlint/cli')) {
                console.log(
                    chalk.blue(
                        `${figures.triangleRight} Configuring Commitlint...`
                    )
                );
                // installing conventional commits config
                console.log(
                    chalk.green(`Installing @commitlint/config-conventional...`)
                );
                await execa(
                    'npm',
                    ['install', '-D', '@commitlint/config-conventional'],
                    {
                        stdio: 'inherit',
                        cwd: projectName,
                    }
                );
                // setting up the config into the project
                fs.writeFileSync(
                    `${projectName}/commitlint.config.js`,
                    `module.exports = { extends: ["@commitlint/config-conventional"] };`
                );
            }

            // Setting up prettier config
            if (selectedDependencies.includes('prettier')) {
                console.log(
                    chalk.blue(
                        `${figures.triangleRight}Configuring Prettier with default values...`
                    )
                );
                fs.writeFileSync(
                    `${projectName}/.prettierrc.json`,
                    `{ "semi": true, "singleQuote": true, "tabWidth": 4, "trailingComma": "es5", "printWidth": 80}`
                );
            }

            // Setting up husky files
            if (selectedDependencies.includes('husky')) {
                console.log(
                    chalk.blue(
                        `${figures.triangleRight} Configuring Husky and Git hooks...`
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

                console.log(
                    chalk.green('Husky and Git hooks set up successfully!')
                );
            }

            // Setting up prettier config
            if (selectedDependencies.includes('@tanstack/react-query')) {
                // installing conventional commits config
                console.log(
                    chalk.green(`Installing React Query ESLint Plugin (recommended)...`)
                );
                await execa(
                    'npm',
                    ['install', '-D', '@tanstack/eslint-plugin-query'],
                    {
                        stdio: 'inherit',
                        cwd: projectName,
                    }
                );
            }

            // Modify package.json to add lint-staged and husky
            const packageJsonPath = path.join(projectName, 'package.json');
            const packageJson = JSON.parse(
                fs.readFileSync(packageJsonPath, 'utf8')
            );

            // Add scripts, lint-staged, and husky configurations
            packageJson.scripts = {
                ...packageJson.scripts,
                prepare: 'husky install',
                format: 'prettier --write .',
            };

            // adding lint-staged if selected
            if (selectedDependencies.includes('lint-staged')) {
                packageJson['lint-staged'] = {
                    '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
                    '*css': ['stylelint --fix', 'prettier --write'],
                };
            }

            // adding commitlint to husky hooks if selected
            if (
                selectedDependencies.includes('husky') &&
                selectedDependencies.includes('@commitlint/cli')
            ) {
                packageJson.husky = {
                    hooks: {
                        'commit-msg': 'npx --no-install commitlint --edit $1',
                    },
                };
            }

            // Write the modified package.json back to disk
            fs.writeFileSync(
                packageJsonPath,
                JSON.stringify(packageJson, null, 2),
                'utf8'
            );

            // custom storybook auto setup for nextjs if found
            if (selectedDependencies.includes('storybook')) {
                console.log(
                    chalk.green(
                        `Installing & Configuring Storybook (this might take a while)...`
                    )
                );
                await execa('npx', ['storybook@latest', 'init'], {
                    stdio: 'inherit',
                    cwd: projectName,
                });
            }
        }

        // spinner.stop(true);
        console.log(
            chalk.green(
                `\n✨ ${figures.tick} Your Next.js project is ready to go! \n\n${chalk.bold(
                    'Happy coding!'
                )} 🎉 ${chalk.cyan('\nEnjoy your customized development setup!')}\n`
            )
        );
    } catch (error) {
        // spinner.stop(true);
        console.error(chalk.red('Error creating project: '), error);
    }
}

createNextApp();
