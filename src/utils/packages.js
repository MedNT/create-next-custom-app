import { dependenciesType } from './statics.js';

export const uiLibChoices = [
  {
    name: 'No',
    value: 'false',
    type: '',
  },
  {
    name: 'Shadcn UI',
    value: 'shadcnui',
    type: dependenciesType.init,
  },
  {
    name: 'Chakra UI',
    value: 'chakraui',
    type: dependenciesType.init,
  },
];

export const formLibChoices = [
  {
    name: 'No',
    value: 'false',
    type: '',
  },
  {
    name: 'Formik',
    value: 'formik',
    type: dependenciesType.prod,
  },
  {
    name: 'Ract Hook Form',
    value: 'react-hook-form',
    type: dependenciesType.prod,
  },
];

export const schemaLibchoices = [
  {
    name: 'No',
    value: 'false',
    type: '',
  },
  {
    name: 'Zod',
    value: 'zod',
    type: dependenciesType.prod,
  },
  {
    name: 'Yup',
    value: 'yup',
    type: dependenciesType.prod,
  },
];

export const ormLibChoices = [
  {
    name: 'No',
    value: 'false',
    type: '',
  },
  {
    name: 'Prisma: For database management and ORM',
    value: 'prisma',
    type: dependenciesType.prod,
  },
  {
    name: 'TypeORM: For SQL databases',
    value: 'prisma',
    type: dependenciesType.prod,
  },
  {
    name: 'Mongoose: For working with MongoDB',
    value: 'mongoose',
    type: dependenciesType.prod,
  },
];

export const additionalPackagesChoices = [
  {
    name: 'Husky: for git hooks',
    value: 'husky',
    type: dependenciesType.dev,
    checked: true,
  },
  {
    name: 'Commitlint: for conventional commits',
    value: '@commitlint/cli',
    type: dependenciesType.dev,
    checked: true,
  },
  {
    name: 'LintStaged: for linting',
    value: 'lint-staged',
    type: dependenciesType.dev,
    checked: true,
  },
  {
    name: 'Prettier: for code formatting',
    value: 'prettier',
    type: dependenciesType.dev,
    checked: true,
  },
  {
    name: 'NextAuth: for authentication',
    value: 'next-auth',
    type: dependenciesType.prod,
  },
  {
    name: 'React Query: for server state sync',
    value: '@tanstack/react-query',
    type: dependenciesType.prod,
  },
  {
    name: 'Zustand: for lightweight state management',
    value: 'zustand',
    type: dependenciesType.prod,
  },
  {
    name: 'Framer Motion: for animations (not compatible for now with Nextjs15 - because of react 19.0.0-rc)',
    value: 'framer-motion',
    type: dependenciesType.prod,
  },
  {
    name: 'Storybook: for building UI components',
    value: 'storybook',
    type: dependenciesType.init,
  },
  {
    name: 'Jest: for unit testing',
    value: 'jest',
    type: dependenciesType.dev,
  },
  {
    name: 'React Testing Library: For testing React components',
    value: '@testing-library/react',
    type: dependenciesType.dev,
  },
  {
    name: 'Cypress: for end-to-end & component testing',
    value: 'cypress',
    type: dependenciesType.dev,
  },
];
