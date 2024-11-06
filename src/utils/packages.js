import { dependenciesType, librairies } from './statics.js';

export const uiLibChoices = [
  {
    name: 'No',
    value: 'false',
    type: '',
  },
  {
    name: 'Shadcn UI',
    value: librairies.shadcnui,
    type: dependenciesType.init,
  },
  {
    name: 'Daisy UI',
    value: librairies.daisyui,
    type: dependenciesType.init,
  },
  {
    name: 'Chakra UI',
    value: librairies.chakraui,
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
    value: librairies.formik,
    type: dependenciesType.prod,
  },
  {
    name: 'Ract Hook Form',
    value: librairies.react_hook_form,
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
    value: librairies.zod,
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
    value: librairies.prisma,
    type: dependenciesType.prod,
  },
  {
    name: 'Mongoose: For working with MongoDB',
    value: librairies.mongoose,
    type: dependenciesType.prod,
  },
];

export const additionalPackagesChoices = [
  {
    name: 'Husky: for git hooks',
    value: librairies.husky,
    type: dependenciesType.dev,
    checked: true,
  },
  {
    name: 'Commitlint: for conventional commits',
    value: librairies.commitlint,
    type: dependenciesType.dev,
    checked: true,
  },
  {
    name: 'LintStaged: for linting',
    value: librairies.lint_staged,
    type: dependenciesType.dev,
    checked: true,
  },
  {
    name: 'Prettier: for code formatting',
    value: librairies.prettier,
    type: dependenciesType.dev,
    checked: true,
  },
  {
    name: 'NextAuth: for authentication',
    value: librairies.next_auth,
    type: dependenciesType.prod,
  },
  {
    name: 'React Query: for server state sync',
    value: librairies.react_query,
    type: dependenciesType.prod,
  },
  {
    name: 'Zustand: for lightweight state management',
    value: librairies.zustand,
    type: dependenciesType.prod,
  },
  {
    name: 'Framer Motion: for animations (not compatible for now with Nextjs15 - because of react 19.0.0-rc)',
    value: librairies.framer_motion,
    type: dependenciesType.prod,
  },
  {
    name: 'Storybook: for building UI components',
    value: librairies.storybook,
    type: dependenciesType.init,
  },
  {
    name: 'Jest: for unit testing',
    value: librairies.jest,
    type: dependenciesType.dev,
  },
  {
    name: 'React Testing Library: For testing React components',
    value: librairies.react_testing_library,
    type: dependenciesType.dev,
  },
  {
    name: 'Cypress: for end-to-end & component testing',
    value: librairies.cypress,
    type: dependenciesType.dev,
  },
];
