import { additionalPackagesChoices } from "./packages.js";
import { defaultAppName, nextJSVersionsChoices } from "./statics.js";

// Prompt user for inputs using a check box
export async function checkBoxPromptForProjectDetails() {
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
            default: defaultAppName,
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