#!/usr/bin/env node

import chalk from 'chalk';
import figures from 'figures';
import fs from 'fs';
import path from 'path';
import { execa } from 'execa';
import welcome from './helpers/welcome.js';
import { checkBoxPromptForProjectDetails } from './utils/mainPrompt.js';
import { installDependencies, splitDependenciesByType } from './helpers/hooks.js';
import { commitlintConfig, huskyandCommitlintConfig, huskyConfig, lintstagedConfig, prettierConfig, reactqueryConfig, storybookConfig } from './utils/configs.js';

// Create Next.js Custom app Main Function
(async function main() {
    /**
     * Extracting all project information from user
     * App name
     * App version
     * Dependencies (dev, prod)
     */
    const { projectName, version, selectedDependencies, dependenciesWithType } =
        await checkBoxPromptForProjectDetails();

    /**
     * Message showing the selected project name (if not selected,default name is returned) and the NextJS version
     */
    console.log(
        chalk.blue(
            `${figures.triangleRight} Creating your Custom Next.js project with CNCA "${projectName} version ${version}"...`
        )
    );

    /**
     * Custom Branded Welcome Message
     */
    await welcome();

    // proceed with the creation of the nextjs app
    try {
        /**
         * creating the base NextJS app using the "create-next-app" utility
         */
        await execa('npx', [`create-next-app@${version}`, projectName], {
            stdio: 'inherit',
        });

        /**
         * Filtering dependencies to: Dev, Prod, Init
         */
        const { devDependencies, prodDependencies, initDependencies } =
            splitDependenciesByType(dependenciesWithType);

        /**
         * Start of dependencies installation process
         * If the user has selected some dependencies, then we start the setup process
         * Else we quit
         */
        if (selectedDependencies.length > 0) {
            // process start message indicator
            console.log(
                chalk.bgGreen(
                    `${figures.triangleRight} Installing additional selected dependencies...`
                )
            );
            // intalling production based dependencies if exists
            if(prodDependencies.length > 0) installDependencies(prodDependencies);
            // development dependencies if exists
            if(devDependencies.length > 0) installDependencies(devDependencies);
        }
        /**
         * End of dependencies installation process
         */

        /**
         * Start of dependencies auto configuration process
         * If the user has selected some dependencies, then we start the setup process
         * Else we quit
         */
        if (selectedDependencies.length > 0) {
            // Setting up commitlint
            if (selectedDependencies.includes('@commitlint/cli')) {
                commitlintConfig("CommitLint", projectName);
            }

            // Setting up prettier config
            if (selectedDependencies.includes('prettier')) {
                prettierConfig("Prettier", projectName);
            }

            // Setting up husky files
            if (selectedDependencies.includes('husky')) {
                huskyConfig("Husky", projectName);
            }

            // Setting up react-query plugin
            if (selectedDependencies.includes('@tanstack/react-query')) {
                reactqueryConfig("React Query", projectName);
            }

            // adding lint-staged if selected
            if (selectedDependencies.includes('lint-staged')) {
                lintstagedConfig("Lint Staged", projectName);
            }

            // adding commitlint to husky hooks if selected
            if (
                selectedDependencies.includes('husky') &&
                selectedDependencies.includes('@commitlint/cli')
            ) {
                huskyandCommitlintConfig("Husky with Commitlint", projectName);
            }

            // custom storybook auto setup for nextjs if found
            if (selectedDependencies.includes('storybook')) {
                storybookConfig("StoryBook", projectName);
            }
        }

        /**
         * Custom Successful Finish Message
         */
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
})();
