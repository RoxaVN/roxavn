import { LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { ServiceLoaderItem, servicesLoader } from '@roxavn/core/server';
import { GetProjectApiService } from '../../../../server';

export default function () {
  const data = useLoaderData<typeof loader>();

  return <div>{JSON.stringify(data.project)}</div>;
}

export function loader(args: LoaderArgs) {
  return servicesLoader.load(args, {
    project: new ServiceLoaderItem(GetProjectApiService, {
      checkPermission: true,
    }),
  });
}
