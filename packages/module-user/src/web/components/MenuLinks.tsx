import { NavLink } from '@mantine/core';
import { canAccessApi, PageItem, useRoles, WebModule } from '@roxavn/core/web';
import { IconChevronRight } from '@tabler/icons';
import { Fragment } from 'react';
import { Link, matchPath, Path, resolvePath } from 'react-router-dom';

interface PageLink {
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

export interface MenuLinksProps {
  pageItems: PageItem[];
  module: WebModule;
  basePath: string;
}

export const MenuLinks = ({ pageItems, module, basePath }: MenuLinksProps) => {
  const _pageLinks = usePageLinks(pageItems, module, basePath);

  const makeLinks = (pageLinks: PageLink[]) =>
    pageLinks.map((pageLink) => {
      const props: any = {
        key: pageLink.key,
        icon: pageLink.icon,
        label: pageLink.label,
        description: pageLink.description,
      };
      if (pageLink.children) {
        props.rightSection = <IconChevronRight size={14} stroke={1.5} />;
        props.children = makeLinks(pageLink.children);
      }
      if (pageLink.isActive) {
        props.variant = 'filled';
        props.active = true;
      } else {
        props.component = Link;
        props.to = pageLink.path;
      }
      return <NavLink {...props} />;
    });

  return <Fragment>{makeLinks(_pageLinks)}</Fragment>;
};
