import { Select } from '@mantine/core';
import {
  ApiConfirmFormGroup,
  ApiFormGroup,
  userService,
  utils,
  webModule as coreWebModule,
} from '@roxavn/core/web';
import { ApiTable, useApi } from '@roxavn/core/web';
import { IconPlus, IconTrash } from '@tabler/icons';
import { Fragment } from 'react';

import { roleApi, roleUserApi, userRoleApi } from '../../base';
import { webModule } from '../module';

export interface RoleUsersProps {
  module?: string;
  scope?: string;
  scopeId?: string;
}

export const RoleUsers = ({ scope, scopeId, module }: RoleUsersProps) => {
  const { data } = useApi(roleApi.getMany, { scope, scopeId, module });
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;

  if (data) {
    const selectInput = (
      <Select
        withinPortal
        label={t('role')}
        data={data.items.map((item) => ({
          value: item.id as any,
          label: item.name,
        }))}
      />
    );
    return (
      <ApiTable
        api={roleUserApi.getMany}
        apiParams={{ roleId: data.items[0]?.id, scopeId, module }}
        filters={[{ name: 'roleId', input: selectInput }]}
        headerActions={[
          {
            label: tCore('add'),
            icon: IconPlus,
            modal: {
              title: t('addRole'),
              children: (
                <ApiFormGroup
                  api={userRoleApi.create}
                  apiParams={{ scopeId, module }}
                  fields={[
                    {
                      name: 'userId',
                      input: <userService.input label={t('user')} />,
                    },
                    { name: 'roleId', input: selectInput },
                  ]}
                />
              ),
            },
          },
        ]}
        columns={{
          id: { label: tCore('id'), reference: userService.reference },
          username: { label: t('username') },
          createdDate: {
            label: tCore('createdDate'),
            render: utils.Render.datetime,
          },
        }}
        cellActions={(item, fetcherRef) => [
          {
            label: tCore('delete'),
            icon: IconTrash,
            modal: (closeModal) => ({
              title: t('deleteUserRole', {
                role: data.items.find(
                  (i) => i.id === fetcherRef.currentParams.roleId
                )?.name,
              }),
              children: (
                <ApiConfirmFormGroup
                  api={userRoleApi.delete}
                  apiParams={{
                    roleId: fetcherRef.currentParams.roleId,
                    userId: item.id,
                    scopeId,
                    module,
                  }}
                  onCancel={closeModal}
                />
              ),
            }),
          },
        ]}
      />
    );
  }
  return <Fragment />;
};
