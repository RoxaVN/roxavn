import { Card, Tabs } from '@mantine/core';
import { LoaderArgs } from '@remix-run/node';
import { servicesLoader } from '@roxavn/core/server';
import {
  useLoaderData,
  webModule as coreWebModule,
  userService,
  ApiRolesGetter,
  useAuthUser,
  useCanAccessApi,
} from '@roxavn/core/web';
import { userRoleApi } from '@roxavn/module-user/base';
import { IconSubtask, IconUsers } from '@tabler/icons-react';

import {
  GetProjectApiService,
  GetProjectRootTaskApiService,
} from '../../../../server';
import { ProjectInfo, TaskPreview } from '../../../components';
import { webModule } from '../../../module';
import { scopes } from '../../../../base';

export default function () {
  const data = useLoaderData<typeof loader>();
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  const user = useAuthUser();
  const allowMembers = useCanAccessApi(userService.roleUsersAccessApi, {
    scope: scopes.Project.name,
    scopeId: data.project.id,
  });

  return (
    <div>
      {user && (
        <ApiRolesGetter
          api={userRoleApi.getAll}
          apiParams={{
            userId: user.id,
            scopes: [scopes.Project.name],
            scopeId: data.project.id,
          }}
        >
          <span />
        </ApiRolesGetter>
      )}
      <ProjectInfo project={data.project} />
      <Tabs defaultValue="tasks" mb="md" keepMounted={false}>
        <Tabs.List mb="md">
          <Tabs.Tab value="tasks" icon={<IconSubtask size="0.8rem" />}>
            {t('tasks')}
          </Tabs.Tab>
          <Tabs.Tab
            value="members"
            disabled={!allowMembers}
            icon={<IconUsers size="0.8rem" />}
          >
            {tCore('members')}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="tasks">
          <Card shadow="md" padding="md" radius="md" withBorder>
            <TaskPreview task={data.task} />
          </Card>
        </Tabs.Panel>
        <Tabs.Panel value="members">
          <userService.roleUsers
            scopeId={data.project.id}
            scope={scopes.Project.name}
          />
        </Tabs.Panel>
      </Tabs>
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
