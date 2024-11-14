import { dependenciesType, newReadmeData } from '../utils/statics.js';
import fs from 'fs';
import chalk from 'chalk';
import { execa } from 'execa';
import path from 'path';
import process from 'process';

/**
 * Return the package.json object into javascript object
 * @param {string} projectName the project folder name
 * @returns jsobject, filePath
 */
export function getPackageDotJson(projectName) {
  const packageJsonPath = path.join(projectName, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return {
    packageJson,
    packageJsonPath,
  };
}

/**
 * Appends to the packages.json file
 * @param {object} data Javascript object
 * @param {string} path Package.jso, file path
 */
export function putPackageDotJson(data, path) {
  // Write the modified package.json back to disk
  fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Split dependencies into 3 types "prod", "dev", "init"
 * @param {Array} dependenciesWithType Array of dependencies with type
 * @returns
 */
export function splitDependenciesByType(dependenciesWithType) {
  return {
    // fetching developement dependencies
    devDependencies: dependenciesWithType
      .filter((d) => d.type === dependenciesType.dev)
      .map((d) => d.value.trim()),
    // fetching production dependencies
    prodDependencies: dependenciesWithType
      .filter((d) => d.type === dependenciesType.prod)
      .map((d) => d.value.trim()),
    // fetching dependencies that needs an init setup using npx (e.g. storybook)
    initDependencies: dependenciesWithType
      .filter((d) => d.type === dependenciesType.init)
      .map((d) => d.value.trim()),
  };
}

/**
 * installing dependencies from an array of dependencies by type
 * @param {Array} dependencies
 * @param {enum} dependencyType : 'dev' | 'prod' | 'init'
 */
export async function installDependencies(
  dependencies,
  dependencyType,
  projectName,
  projectVersion
) {
  // intalling production based dependencies
  for (let i = 0; i < dependencies.length; i++) {
    // production dependencies start message indicator
    console.log(
      chalk.green(
        `Installing ${dependencyType === 'prod' ? 'Production' : 'Development'} Dependency: ${dependencies[i]}...`
      )
    );
    // if it's a production based dependency
    if (dependencyType === 'prod') {
      // a temporary test while nextjs15 is using react 19 canary version!
      // TODO: to remove in the future
      if(parseInt(projectVersion) === 15) {
        await execa('npm', ['install', dependencies[i], '--legacy-peer-deps'], {
          stdio: 'inherit',
          cwd: projectName,
        });
      } else {
        await execa('npm', ['install', dependencies[i]], {
          stdio: 'inherit',
          cwd: projectName,
        });
      }
    }
    // if it's a development based dependency
    else {
      // a temporary test while nextjs15 is using react 19 canary version!
      // TODO: to remove in the future
      if(parseInt(projectVersion) === 15) {
        await execa('npm', ['install', '-D', dependencies[i], '--legacy-peer-deps'], {
          stdio: 'inherit',
          cwd: projectName,
        });
      } else {
        await execa('npm', ['install', '-D', dependencies[i]], {
          stdio: 'inherit',
          cwd: projectName,
        });
      }
    }
  }
}

export function createCustomReadmeFile(projectName) {
  // Path to the new Next.js app
  const appPath = path.join(process.cwd(), projectName);

  fs.writeFile(path.join(appPath, 'README.md'), newReadmeData, (err) => {
    if (err) {
      console.error(`Error writing to README file: ${err}`);
    } else {
      console.log('Custom content appended to README.md successfully!');
    }
  });
}
