import { matchPath, Path, resolvePath, useLocation } from 'react-router-dom';

import { canAccessApi, useRoles } from '../components';
import { PageItem, WebModule } from '../services';

export interface PageLink {
  key: string;
  isActive: boolean;
  icon: React.ReactNode;
  label: React.ReactNode;
  description: React.ReactNode;
  path?: Path;
  children?: Array<PageLink>;
}

export const usePageLinks = (
  pageItems: PageItem[],
  module: WebModule,
  basePath: string
): Array<PageLink> => {
  const { t } = module.useTranslation();
  const location = useLocation();
  const roles = useRoles();

  const parseItems = (items: PageItem[]) => {
    const result: Array<PageLink> = [];
    for (const [index, pageItem] of items.entries()) {
      if (!pageItem.label) {
        continue;
      }
      if (pageItem.element) {
        const childProps: any = pageItem.element.props;
        if (!canAccessApi(roles, childProps.api, childProps.apiParams)) {
          continue;
        }
      }
      const pagePath = pageItem.path
        ? resolvePath(module.escapedName + pageItem.path, basePath)
        : undefined;
      result.push({
        key: (index + 1).toString(),
        label:
          typeof pageItem.label === 'function'
            ? pageItem.label(t)
            : pageItem.label,
        description:
          typeof pageItem.description === 'function'
            ? pageItem.description(t)
            : pageItem.description,
        icon: pageItem.icon && <pageItem.icon size={16} stroke={1.5} />,
        children: pageItem.children && parseItems(pageItem.children),
        path: pagePath,
        isActive: pagePath
          ? !!matchPath(pagePath.pathname, location.pathname)
          : false,
      });
    }
    return result;
  };

  return parseItems(pageItems);
};
