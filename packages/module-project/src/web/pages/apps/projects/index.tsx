import { Card, Text } from '@mantine/core';
import { LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { ServiceLoaderItem, servicesLoader } from '@roxavn/core/server';
import { PaginationLinks, utils } from '@roxavn/core/web';

import { constants } from '../../../../base';
import { GetProjectsApiService } from '../../../../server';

export default function () {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      {data.projects.items.map((item) => (
        <Card key={item.id}>
          <Text weight="500">{item.name}</Text>
          <Text size="sm" color="dimmed">
            {utils.Render.relativeTime(item.updatedDate)}
          </Text>
        </Card>
      ))}
      <PaginationLinks
        my="md"
        data={data.projects.pagination}
        locationKey="projects"
      />
    </div>
  );
}

export function loader(args: LoaderArgs) {
  return servicesLoader.load(args, {
    projects: new ServiceLoaderItem(GetProjectsApiService, {
      type: constants.ProjectTypes.PUBLIC,
    }),
  });
}