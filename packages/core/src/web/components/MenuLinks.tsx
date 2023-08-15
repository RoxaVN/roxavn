import { NavLink } from '@mantine/core';
import { Link } from '@remix-run/react';
import { IconChevronRight } from '@tabler/icons-react';
import { Fragment } from 'react';

import { PageLink, usePageLinks } from '../hooks/index.js';
import { PageItem } from '../services/index.js';

export interface MenuLinksProps {
  pageItems: PageItem[];
  basePath: string;
}

export const MenuLinks = ({ pageItems, basePath }: MenuLinksProps) => {
  const _pageLinks = usePageLinks(pageItems, basePath);

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
