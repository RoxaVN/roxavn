import { Tabs } from '@mantine/core';
import { useNavigate } from '@remix-run/react';

import { usePageLinks } from '../hooks/index.js';
import { PageItem } from '../services/index.js';

export interface TabLinksProps {
  pageItems: PageItem[];
  basePath: string;
}

export const TabLinks = ({ pageItems, basePath }: TabLinksProps) => {
  const _pageLinks = usePageLinks(pageItems, basePath);
  const navigate = useNavigate();

  return (
    <Tabs
      defaultValue={_pageLinks.find((p) => p.isActive)?.key}
      onTabChange={(value) => {
        const pageLink = _pageLinks.find((p) => p.key === value);
        if (pageLink && pageLink.path) {
          navigate(pageLink.path);
        }
      }}
    >
      <Tabs.List>
        {_pageLinks.map((pageLink) => (
          <Tabs.Tab
            value={pageLink.key}
            key={pageLink.key}
            icon={pageLink.icon}
          >
            {pageLink.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
};
