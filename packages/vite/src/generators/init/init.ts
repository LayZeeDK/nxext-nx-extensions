import {
  Tree,
  updateJson,
  formatFiles,
  convertNxGenerator,
} from '@nrwl/devkit';

import { Schema } from './schema';
import { addJestPlugin } from './lib/add-jest-plugin';
import { updateDependencies } from './lib/add-dependencies';
import { addVitestPlugin } from './lib/add-vitest-plugin';

function removeViteFromDeps(tree: Tree) {
  updateJson(tree, 'package.json', (json) => {
    delete json.dependencies['@nxext/vite'];
    delete json.dependencies['vite'];
    return json;
  });
}

export async function viteInitGenerator(host: Tree, options: Schema) {
  const jestTask = addJestPlugin(host, options);
  const vitestTask = addVitestPlugin(host, options);
  const installTask = updateDependencies(host);

  removeViteFromDeps(host);

  if (!options.skipFormat) {
    await formatFiles(host);
  }

  return async () => {
    await jestTask();
    await vitestTask();
    await installTask();
  };
}

export default viteInitGenerator;
export const initSchematic = convertNxGenerator(viteInitGenerator);
