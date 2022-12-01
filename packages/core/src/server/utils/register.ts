import minimatch from 'minimatch';
import path from 'path';

import { AppConfig } from '@remix-run/dev';
import { visitFiles } from '.';
import { appConfig } from '../app.config';

type RoutesConfig = Exclude<AppConfig['routes'], undefined>;
type RouteManifest = Awaited<ReturnType<RoutesConfig>>;
type DefineRoutes = Parameters<RoutesConfig>[0];
type DefineRouteFunction = Parameters<Parameters<DefineRoutes>[0]>[0];

const routeModuleExts = ['.js', '.jsx', '.ts', '.tsx', '.md', '.mdx'];

function isRouteModuleFile(filename: string): boolean {
  return routeModuleExts.includes(path.extname(filename));
}

export function registerApiRoutes() {
  Object.keys(appConfig.get().modules).map((module) => {
    try {
      if (module !== '.') {
        require(module + '/server');
      }
    } catch (e) {}
  });
}

export function registerWebRoutes(defineRoutes: DefineRoutes) {
  const modules = Object.keys(appConfig.get().modules);
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
  const result: RouteManifest = {};
  for (const module of modules) {
    try {
      const pathToModule =
        module === '.'
          ? '../../src/web'
          : path.dirname(require.resolve(module + '/web'));
      const routesDir = path.join(pathToModule, 'pages');
      const routes = defineConventionsRoutes(
        path.relative('.', routesDir),
        defineRoutes
      );
      Object.assign(result, routes);
    } catch (e) {}
  }
  return result;
}

function defineConventionsRoutes(
  dir: string,
  defineRoutes: DefineRoutes,
  ignoredFilePatterns?: string[]
): RouteManifest {
  const files: { [routeId: string]: string } = {};

  visitFiles(dir, (file) => {
    if (
      file.endsWith('.d.ts') ||
      (ignoredFilePatterns &&
        ignoredFilePatterns.some((pattern) => minimatch(file, pattern)))
    ) {
      return;
    }

    if (isRouteModuleFile(file)) {
      const routeId = createRouteId(path.join(dir, file));
      files[routeId] = path.join(dir, file);
      return;
    }

    throw new Error(`Invalid route module file: ${path.join(dir, file)}`);
  });

  const routeIds = Object.keys(files).sort(byLongestFirst);

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
        routeId.slice((parentId || dir).length + 1)
      );

      const isIndexRoute = routeId.endsWith('/index');
      const fullPath = createRoutePath(routeId.slice(dir.length + 1));
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
  return routeIds.find((id) => childRouteId.startsWith(`${id}/`));
}

function byLongestFirst(a: string, b: string): number {
  return b.length - a.length;
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
