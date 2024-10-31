import { dependenciesType } from '../utils/statics.js';
import fs from 'fs';
import chalk from 'chalk';
import { execa } from 'execa';
import path from 'path';

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

  return {
    devDependencies,
    prodDependencies,
    initDependencies,
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
  projectName
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
      await execa('npm', ['install', dependencies[i]], {
        stdio: 'inherit',
        cwd: projectName,
      });
    }
    // if it's a development based dependency
    else {
      await execa('npm', ['install', '-D', dependencies[i]], {
        stdio: 'inherit',
        cwd: projectName,
      });
    }
  }
}
