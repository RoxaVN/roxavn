import { LoaderArgs } from '@remix-run/node';
import { servicesLoader } from '@roxavn/core/server';
import { useLoaderData } from '@roxavn/core/web';

import { GetProjectApiService, GetTaskApiService } from '../../../../../server';
import { ProjectInfo, TaskInfo } from '../../../../components';

export default function () {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <ProjectInfo project={data.project} />
      <TaskInfo task={data.task} />
    </div>
  );
}

export function loader(args: LoaderArgs) {
  return servicesLoader.load(args, {
    task: {
      service: GetTaskApiService,
      checkPermission: true,
    },
    project: {
      service: GetProjectApiService,
      params: (data) => ({
        projectId: data.task.projectId,
      }),
    },
  });
}
