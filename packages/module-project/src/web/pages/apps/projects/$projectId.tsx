import { Card } from '@mantine/core';
import { LoaderArgs } from '@remix-run/node';
import { servicesLoader } from '@roxavn/core/server';
import { useLoaderData } from '@roxavn/core/web';
import {
  GetProjectApiService,
  GetProjectRootTaskApiService,
} from '../../../../server';
import { ProjectInfo, TaskPreview } from '../../../components';

export default function () {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <ProjectInfo project={data.project} />
      <Card shadow="md" padding="md" radius="md" mb="md" withBorder>
        <TaskPreview task={data.task} />
      </Card>
    </div>
  );
}

export function loader(args: LoaderArgs) {
  return servicesLoader.load(args, {
    project: {
      service: GetProjectApiService,
      checkPermission: true,
    },
    task: {
      service: GetProjectRootTaskApiService,
    },
  });
}
