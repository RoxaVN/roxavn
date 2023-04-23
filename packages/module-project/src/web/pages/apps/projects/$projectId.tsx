import { LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { servicesLoader } from '@roxavn/core/server';
import {
  GetProjectApiService,
  GetProjectRootTaskApiService,
} from '../../../../server';
import { ProjectInfo } from '../../../components';

export default function () {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <ProjectInfo project={data.project as any} />
      <p>{JSON.stringify(data.task)}</p>
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
