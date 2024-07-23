import * as fs from 'node:fs';
import * as path from 'node:path';
import nunjucks, { ConfigureOptions } from 'nunjucks';

import { RenderContext } from './renderContext';
import { deepMerge, sortDependencies } from './objects';
import {
  camelCase,
  kebabCase,
  pascalCase,
  snakeCase,
  titleCase,
} from './strings';

/**
 * Renders a template folder/file to the provided destination,
 * by recursively copying all files under the source directory,
 * with the following exception:
 *   - `_.filename` are renamed to `.filename`.
 *   - `package.json` files are merged.
 *   - `.gitignore` files are concatenated.
 *   - `.njk` files are rendered as nunjucks templates
 *     and saved without the `.njk` extension.
 */
export function renderTemplate(ctx: RenderContext, src: string, dest: string) {
  const stats = fs.statSync(src);

  // Recursively render directories.
  if (stats.isDirectory()) {
    // Skip node_module.
    if (path.basename(src) === 'node_modules') return;

    // Render its subdirectories and files recursively.
    fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      renderTemplate(ctx, path.resolve(src, file), path.resolve(dest, file));
    }
    return;
  }

  const filename = path.basename(src);

  // Rename `_.file` to `.file` in the destination.
  if (filename.startsWith('_.')) {
    dest = path.resolve(path.dirname(dest), filename.replace(/^_./, '.'));
  }

  // Concatenate .gitignore files.
  if (filename === '_.gitignore' && fs.existsSync(dest)) {
    const existing = fs.readFileSync(dest, 'utf8');
    const newGitignore = fs.readFileSync(src, 'utf8');
    fs.writeFileSync(dest, existing + '\n' + newGitignore);
    return;
  }

  // Merge package.json files.
  if (filename === 'package.json' && fs.existsSync(dest)) {
    const existing = JSON.parse(fs.readFileSync(dest, 'utf8'));
    const newPackage = JSON.parse(fs.readFileSync(src, 'utf8'));
    const pkg = sortDependencies(deepMerge(existing, newPackage));
    fs.writeFileSync(dest, JSON.stringify(pkg, null, 2) + '\n');
    return;
  }

  // Render nunjucks templates.
  if (filename.endsWith('.njk')) {
    dest = dest.replace(/\.njk$/, '');
    fs.writeFileSync(dest, resolveNunjunksTemplate(src, ctx));
    fs.chmodSync(dest, stats.mode);
    return;
  }

  fs.copyFileSync(src, dest);
}

function resolveNunjunksTemplate(
  file: string,
  context?: object,
  options?: ConfigureOptions
): string {
  const directory = path.dirname(file);
  const filename = path.basename(file);
  const env = nunjucks.configure(directory, {
    trimBlocks: true,
    autoescape: false,
    ...options,
  });
  env.addFilter('pascalCase', pascalCase);
  env.addFilter('camelCase', camelCase);
  env.addFilter('snakeCase', snakeCase);
  env.addFilter('kebabCase', kebabCase);
  env.addFilter('titleCase', titleCase);
  return env.render(filename, context);
}
