import { NavLink } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { PageLink, usePageLinks } from '../hooks';
import { PageItem, WebModule } from '../services';

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
