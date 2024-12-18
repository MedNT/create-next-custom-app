#!/usr/bin/env node

import chalk from 'chalk';
import figures from 'figures';
import { execa } from 'execa';
import welcome from './helpers/welcome.js';
import { checkBoxPromptForProjectDetails } from './utils/mainPrompt.js';
import {
  createCustomReadmeFile,
  installDependencies,
  splitDependenciesByType,
} from './helpers/hooks.js';
import {
  chakrauiConfig,
  commitlintConfig,
  daisyuiConfig,
  huskyandCommitlintConfig,
  huskyConfig,
  lintstagedConfig,
  prettierConfig,
  reactqueryConfig,
  shadcnuiConfig,
  storybookConfig,
} from './utils/configs.js';
import { librairies } from './utils/statics.js';

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
    // eslint-disable-next-line no-unused-vars
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
          `${figures.triangleRight} Installing the custom selected dependencies...`
        )
      );
      // intalling production based dependencies if exists
      if (prodDependencies.length > 0)
        await installDependencies(prodDependencies, 'prod', projectName, version);
      // development dependencies if exists
      if (devDependencies.length > 0)
        await installDependencies(devDependencies, 'dev', projectName, version);
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
      if (selectedDependencies.includes(librairies.commitlint)) {
        await commitlintConfig('CommitLint', projectName);
      }

      // Setting up prettier config
      if (selectedDependencies.includes(librairies.prettier)) {
        await prettierConfig('Prettier', projectName);
      }

      // Setting up husky files
      if (selectedDependencies.includes(librairies.husky)) {
        await huskyConfig('Husky', projectName);
      }

      // Setting up react-query plugin
      if (selectedDependencies.includes(librairies.react_query)) {
        await reactqueryConfig('React Query', projectName);
      }

      // adding lint-staged if selected
      if (selectedDependencies.includes(librairies.lint_staged)) {
        await lintstagedConfig('Lint Staged', projectName);
      }

      // adding commitlint to husky hooks if selected
      if (
        selectedDependencies.includes(librairies.husky) &&
        selectedDependencies.includes(librairies.commitlint)
      ) {
        await huskyandCommitlintConfig('Husky with Commitlint', projectName);
      }

      // custom shadcn/ui auto setup for nextjs if found
      if (selectedDependencies.includes(librairies.shadcnui)) {
        await shadcnuiConfig('shadcn/ui', projectName);
      }

      // custom daisyUI auto setup for nextjs if found
      if (selectedDependencies.includes(librairies.daisyui)) {
        await daisyuiConfig('Daisy UI', projectName);
      }

      // custom chakra/ui auto setup for nextjs if found
      if (selectedDependencies.includes(librairies.chakraui)) {
        await chakrauiConfig('Chakra UI', projectName);
      }

      // custom storybook auto setup for nextjs if found
      if (selectedDependencies.includes(librairies.storybook)) {
        await storybookConfig('StoryBook', projectName);
      }
    }

    /**
     * Last Step: create custom README.md File
     */
    createCustomReadmeFile(projectName);
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
