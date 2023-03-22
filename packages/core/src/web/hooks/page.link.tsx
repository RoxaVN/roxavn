import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { canAccessApi, useRoles } from '../components';
import { PageItem } from '../services';

export interface PageLink {
  key: string;
  isActive: boolean;
  icon: React.ReactNode;
  label: React.ReactNode;
  description: React.ReactNode;
  path?: string;
  children?: Array<PageLink>;
}

export const usePageLinks = (
  pageItems: PageItem[],
  basePath: string,
  options?: {
    goToFirstLink?: boolean;
  }
): Array<PageLink> => {
  const location = useLocation();
  const navigate = useNavigate();
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
      const pagePath =
        pageItem.path !== undefined
          ? basePath + '/' + pageItem.path
          : undefined;
      result.push({
        key: (index + 1).toString(),
        label: pageItem.label,
        description: pageItem.description,
        icon: pageItem.icon && <pageItem.icon size={16} stroke={1.5} />,
        children: pageItem.children && parseItems(pageItem.children),
        path: pagePath,
        isActive: pagePath === location.pathname,
      });
    }
    return result;
  };

  const result = parseItems(pageItems);

  useEffect(() => {
    if (options?.goToFirstLink !== false) {
      if (location.pathname === basePath) {
        const findFirst = (pageLinks: PageLink[]): string | undefined => {
          let firstPath: string | undefined;
          for (const item of pageLinks) {
            if (item.path) {
              firstPath = item.path;
            } else if (item.children) {
              const childPath = findFirst(item.children);
              if (childPath) {
                firstPath = childPath;
              }
            } else if (location.pathname === item.path) {
              throw new Error('Path exists');
            }
          }
          return firstPath;
        };
        try {
          const firstPath = findFirst(result);
          if (firstPath) {
            navigate(firstPath);
          }
        } catch {}
      }
    }
  }, []);

  return result;
};
