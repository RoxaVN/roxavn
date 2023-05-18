import fs from 'fs';
import minimatch from 'minimatch';
import path from 'path';

import { AppConfig } from '@remix-run/dev';
import { visitFiles } from './index.js';
import { BaseModule } from '../../base/index.js';
import { moduleManager } from '../module.manager.js';

type RoutesConfig = Exclude<AppConfig['routes'], undefined>;
type RouteManifest = Awaited<ReturnType<RoutesConfig>>;
type DefineRoutes = Parameters<RoutesConfig>[0];
type DefineRouteFunction = Parameters<Parameters<DefineRoutes>[0]>[0];

const routeModuleExts = ['.js', '.jsx', '.ts', '.tsx', '.md', '.mdx'];

function isRouteModuleFile(filename: string): boolean {
  return routeModuleExts.includes(path.extname(filename));
}

export function registerServerModules() {
  moduleManager.modules.map((module) => {
    try {
      if (module.name !== moduleManager.currentModule.name) {
        const m = require(module.name + '/server').serverModule;
        moduleManager.serverModules.push(m);
      }
    } catch (e) {}
  });
}

export function registerWebRoutes(defineRoutes: DefineRoutes) {
  const modules = moduleManager.modules.map((m) => m.name);
  const result: RouteManifest = {};
  const currentDir = process.cwd();
  process.chdir('.web/app');
  Object.assign(result, definePageRoutes(modules, defineRoutes));
  process.chdir(currentDir);
  return result;
}

function definePageRoutes(
  modules: string[],
  defineRoutes: DefineRoutes
): RouteManifest {
  const modulePages: { name: string; path: string }[] = [];
  for (const module of modules) {
    try {
      const pathToModule =
        module === moduleManager.currentModule.name
          ? '../../src/web'
          : path
              .dirname(require.resolve(module + '/web'))
              .replace('/cjs/', '/esm/'); // simple get esm path, should use import.meta if posible
      const pagesFolder = path.join(pathToModule, 'pages');
      if (fs.existsSync(pagesFolder)) {
        modulePages.push({
          name: module,
          path: path.relative('.', pagesFolder),
        });
      }
    } catch (e) {}
  }
  return defineConventionsRoutes(modulePages, defineRoutes);
}

function defineConventionsRoutes(
  modulePages: { name: string; path: string }[],
  defineRoutes: DefineRoutes,
  ignoredFilePatterns?: string[]
): RouteManifest {
  const files: { [routeId: string]: string } = {};

  modulePages.map((modulePage) => {
    visitFiles(modulePage.path, (file) => {
      if (
        file.endsWith('.d.ts') ||
        (ignoredFilePatterns &&
          ignoredFilePatterns.some((pattern) => minimatch(file, pattern)))
      ) {
        return;
      }

      if (isRouteModuleFile(file)) {
        const routeId = createRouteId(path.join(modulePage.path, file)).replace(
          '{moduleName}',
          BaseModule.escapeName(modulePage.name)
        );
        files[routeId] = path.join(modulePage.path, file);
        return;
      }

      throw new Error(
        `Invalid route module file: ${path.join(modulePage.path, file)}`
      );
    });
  });

  const routeIds = Object.keys(files).sort(
    (a, b) => getPartialRouteId(b).length - getPartialRouteId(a).length
  );

  const uniqueRoutes = new Map<string, string>();

  // Then, recurse through all routes using the public defineRoutes() API
  function defineNestedRoutes(
    defineRoute: DefineRouteFunction,
    parentId?: string
  ): void {
    const childRouteIds = routeIds.filter(
      (id) => findParentRouteId(routeIds, id) === parentId
    );

    for (const routeId of childRouteIds) {
      const routePath: string | undefined = createRoutePath(
        getPartialRouteId(routeId, parentId)
      );

      const isIndexRoute = routeId.endsWith('/index');
      const fullPath = createRoutePath(getPartialRouteId(routeId));
      const uniqueRouteId = (fullPath || '') + (isIndexRoute ? '?index' : '');

      if (uniqueRouteId) {
        if (uniqueRoutes.has(uniqueRouteId)) {
          throw new Error(
            `Path ${JSON.stringify(fullPath)} defined by route ${JSON.stringify(
              routeId
            )} conflicts with route ${JSON.stringify(
              uniqueRoutes.get(uniqueRouteId)
            )}`
          );
        } else {
          uniqueRoutes.set(uniqueRouteId, routeId);
        }
      }

      if (isIndexRoute) {
        const invalidChildRoutes = routeIds.filter(
          (id) => findParentRouteId(routeIds, id) === routeId
        );

        if (invalidChildRoutes.length > 0) {
          throw new Error(
            `Child routes are not allowed in index routes. Please remove child routes of ${routeId}`
          );
        }

        defineRoute(routePath, files[routeId], {
          index: true,
        });
      } else {
        defineRoute(routePath, files[routeId], () => {
          defineNestedRoutes(defineRoute, routeId);
        });
      }
    }
  }

  return defineRoutes(defineNestedRoutes);
}

const escapeStart = '[';
const escapeEnd = ']';

function createRoutePath(partialRouteId: string): string | undefined {
  let result = '';
  let rawSegmentBuffer = '';

  let inEscapeSequence = 0;
  let skipSegment = false;
  function isNewEscapeSequence(char: string, lastChar?: string) {
    return (
      !inEscapeSequence && char === escapeStart && lastChar !== escapeStart
    );
  }

  function isCloseEscapeSequence(char: string, nextChar?: string) {
    return inEscapeSequence && char === escapeEnd && nextChar !== escapeEnd;
  }

  function isStartOfLayoutSegment(char: string, nextChar?: string) {
    return char === '_' && nextChar === '_' && !rawSegmentBuffer;
  }
  for (let i = 0; i < partialRouteId.length; i++) {
    const char = partialRouteId.charAt(i);
    const lastChar = i > 0 ? partialRouteId.charAt(i - 1) : undefined;
    const nextChar =
      i < partialRouteId.length - 1 ? partialRouteId.charAt(i + 1) : undefined;

    if (skipSegment) {
      if (char === '/' || char === '.' || char === path.win32.sep) {
        skipSegment = false;
      }
      continue;
    }

    if (isNewEscapeSequence(char, lastChar)) {
      inEscapeSequence++;
      continue;
    }

    if (isCloseEscapeSequence(char, nextChar)) {
      inEscapeSequence--;
      continue;
    }

    if (inEscapeSequence) {
      result += char;
      continue;
    }

    if (char === '/' || char === path.win32.sep || char === '.') {
      if (rawSegmentBuffer === 'index' && result.endsWith('index')) {
        result = result.replace(/\/?index$/, '');
      } else {
        result += '/';
      }
      rawSegmentBuffer = '';
      continue;
    }

    if (isStartOfLayoutSegment(char, nextChar)) {
      skipSegment = true;
      continue;
    }

    rawSegmentBuffer += char;

    if (char === '$') {
      result += typeof nextChar === 'undefined' ? '*' : ':';
      continue;
    }

    result += char;
  }

  if (rawSegmentBuffer === 'index' && result.endsWith('index')) {
    result = result.replace(/\/?index$/, '');
  }

  return result || undefined;
}

function findParentRouteId(
  routeIds: string[],
  childRouteId: string
): string | undefined {
  return routeIds.find((id) =>
    childRouteId
      .slice(childRouteId.indexOf('/pages'))
      .startsWith(`${id.slice(id.indexOf('/pages'))}/`)
  );
}

function getPartialRouteId(routeId: string, parentId?: string) {
  const pattern = '/pages';
  const routIdSliced = routeId.slice(routeId.indexOf(pattern));
  const parentIdSliced = parentId && parentId.slice(parentId.indexOf(pattern));
  return routIdSliced.slice((parentIdSliced || pattern).length + 1);
}

function createRouteId(file: string) {
  return normalizeSlashes(stripFileExtension(file));
}

function normalizeSlashes(file: string) {
  return file.split(path.win32.sep).join('/');
}

function stripFileExtension(file: string) {
  return file.replace(/\.[a-z0-9]+$/i, '');
}
