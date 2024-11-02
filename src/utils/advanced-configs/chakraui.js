import fs from 'fs';
import path from 'path';

/**
 * Detects the project extenstion Type (javascript or typescript)
 * @param {string} dir path of the root directory
 * @returns {enum} 'ts' | 'js'
 */
export function getProjectFileExtension(dir) {
  return fs.existsSync(path.join(dir, 'tsconfig.json')) ? 'ts' : 'js';
}

/**
 * Locates the layout file based on Next.js router structure
 * @param {string} dir path of the root directory
 * @returns {string} the layout file path
 */
export function findLayoutFilePath(rootDir) {
  const extension = getProjectFileExtension(rootDir);
  const srcPath = fs.existsSync(path.join(rootDir, 'src')) ? 'src/' : '';

  // Possible layout file paths
  const paths = [
    `${srcPath}app/layout.${extension}x`, // app router with layout file
    `${srcPath}pages/_app.${extension}x`, // pages router with _app file
    `${srcPath}pages/index.${extension}x`, // pages router with index file (fallback)
  ];

  for (const layoutPath of paths) {
    if (fs.existsSync(path.join(rootDir, layoutPath))) {
      return path.join(rootDir, layoutPath);
    }
  }
  return null;
}

/**
 * Wrapup the {children} of layout component with the chakra Provider
 * @param {string} layoutFilePath layout file path
 */
export function wrapWithProvider(layoutFilePath) {
  const layoutContent = fs.readFileSync(layoutFilePath, 'utf8');
  const providerImportLine = `import { Provider } from "@/components/ui/provider";`;

  // Check if the import line is already present
  let modifiedContent = `${providerImportLine}\n${layoutContent}`;

  // Wraping `{children}` with `<Provider>{children}</Provider>`
  if (layoutContent.includes('children')) {
    modifiedContent = modifiedContent.replace(
      /({\s*children\s*})/,
      `<Provider>$1</Provider>`
    );
  } else {
    console.error(
      "Could not find 'children' in layout file. Please wrap your application with <Provider>{children}</Provider> manually!"
    );
    return;
  }

  fs.writeFileSync(layoutFilePath, modifiedContent, 'utf8');
  console.log(`Wrapped children with <Provider> in ${layoutFilePath}`);
}

/**
 * adding following {@code} =>
 * experimental: {
 *    optimizePackageImports: ["@chakra-ui/react"],
 * }
 * to the next.config.mjs file
 * @param {string} rootDir path of the root directory
 */
export function updateNextConfig(rootDir) {
  const configFilePath = path.join(rootDir, 'next.config.mjs');

  // Check if next.config.mjs exists
  if (!fs.existsSync(configFilePath)) {
    console.error('No next.config.mjs found, skipping Next.js config update.');
    return;
  }

  const optimizeBundleContent = `
export default {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
}
`;

  // Write the updated content back to next.config.mjs
  fs.writeFileSync(configFilePath, optimizeBundleContent, 'utf8');
  console.log(
    'Updated next.config.mjs with optimizePackageImports for @chakra-ui/react.'
  );
}
