import inquirer from 'inquirer';
import {
  additionalPackagesChoices,
  formLibChoices,
  ormLibChoices,
  schemaLibchoices,
  uiLibChoices,
} from './packages.js';
import { nextJSVersionsChoices } from './statics.js';

export async function checkBoxPromptForProjectDetails() {
  // building the prompt
  const { projectName, version, uiLib, formLib, schemaLib, ormLib, others } =
    await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name: ',
        default: 'default-app',
        validate: (input) => {
          // regex rules
          // must not contain a white space
          // not start & not end with: - or _
          // contains only alphanumeric characters: a-z, A-Z, 0-9
          // has a limit of 20 characters
          const regex = /^(?![-_])([a-zA-Z0-9-_]{1,20})(?<![-_])$/;
          return regex.test(input)
            ? true
            : `❌ Invalid project name: follow the rules 👇\nRules:\n- Must not contains a white space\n- Must not contains underscore _ and hypen - at start & end\n- Accepts only alphanumeric characters: a-z, A-Z, 0-9, -, _\n- Has a limit of 20 characters`;
        },
      },
      {
        type: 'list',
        name: 'version',
        message: 'NextJS version: ',
        default: 'latest',
        choices: nextJSVersionsChoices,
      },
      {
        type: 'list',
        name: 'uiLib',
        message: 'Do you want to install a components library?',
        choices: uiLibChoices,
      },
      {
        type: 'list',
        name: 'formLib',
        message: 'Do you want to install a form management library?',
        choices: formLibChoices,
      },
      {
        type: 'list',
        name: 'schemaLib',
        message: 'Do you want to install a Schema Validation library?',
        choices: schemaLibchoices,
      },
      {
        type: 'list',
        name: 'ormLib',
        message: 'Do you want to install an ORM/database mapping library?',
        choices: ormLibChoices,
      },
      {
        type: 'checkbox',
        name: 'others',
        message: 'Select additional packages to install:',
        choices: additionalPackagesChoices,
      },
    ]);

  // getting selected choices with their type
  const dependenciesWithType = [];

  // choices list to compare with user selected choice
  const compareObjects = [
    [uiLibChoices, uiLib],
    [formLibChoices, formLib],
    [schemaLibchoices, schemaLib],
    [ormLibChoices, ormLib],
  ];

  // Testing if user selected a choice or selected the 'No'
  const isFoundTest = (choicesList, selectedChoice) => {
    return choicesList.find(
      (choice) => choice.value === selectedChoice && choice.value !== 'false'
    );
  };

  // collecting all user selected choices with their type
  // PS: Type will be used later for dependencies setup!
  let isFound = undefined;
  for (let i = 0; i < compareObjects.length; i++) {
    isFound = isFoundTest(compareObjects[i][0], compareObjects[i][1]);
    if (isFound) {
      dependenciesWithType.push({
        name: isFound.name,
        value: isFound.value,
        type: isFound.type,
      });
    }
  }

  // collecting user choices from the checkbox list of "additional dependencies"
  dependenciesWithType.push(
    ...additionalPackagesChoices
      .filter((choice) => others.includes(choice.value))
      .map(({ name, value, type }) => ({ name, value, type }))
  );

  // returning the object that will be working on :D
  return {
    projectName,
    version,
    // dependencies without type
    selectedDependencies: [uiLib, formLib, schemaLib, ...others].filter(
      (choice) => choice !== 'false'
    ),
    // dependencies with type
    dependenciesWithType,
  };
}
