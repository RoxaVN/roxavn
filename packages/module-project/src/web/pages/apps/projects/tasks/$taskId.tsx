import { LoaderArgs } from '@remix-run/node';
import { servicesLoader } from '@roxavn/core/server';
import { ApiRolesGetter, useLoaderData } from '@roxavn/core/web';

import {
  GetProjectApiService,
  GetSubtasksApiService,
  GetTaskApiService,
} from '../../../../../server';
import { ProjectInfo, Subtasks, TaskInfo } from '../../../../components';
import { scopes } from '../../../../../base';

export default function () {
  const data = useLoaderData<typeof loader>();
  const params = scopes.Project.makeScopeParams(data.project.id);

  return (
    <div>
      <ApiRolesGetter apiParams={params} />
      <ProjectInfo project={data.project} />
      <TaskInfo task={data.task} />
      <Subtasks subtasks={data.subtasks} task={data.task} />
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
    subtasks: {
      service: GetSubtasksApiService,
    },
  });
}
