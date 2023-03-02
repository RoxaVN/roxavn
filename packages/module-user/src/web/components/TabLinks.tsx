import { Tabs } from '@mantine/core';
import { PageItem, usePageLinks, WebModule } from '@roxavn/core/web';
import { useNavigate } from 'react-router-dom';

export interface TabLinksProps {
  pageItems: PageItem[];
  module: WebModule;
  basePath: string;
}

export const TabLinks = ({ pageItems, module, basePath }: TabLinksProps) => {
  const _pageLinks = usePageLinks(pageItems, module, basePath);
  const navigate = useNavigate();

  return (
    <Tabs
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
