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
import { Fragment, useEffect, useState } from 'react';

import { roleApi, RoleResponse, roleUserApi, userRoleApi } from '../../base';
import { webModule } from '../module';

export interface RoleUsersProps {
  module?: string;
  scope?: string;
  scopeId?: string;
}

export const RoleUsers = ({ scope, scopeId, module }: RoleUsersProps) => {
  const { data } = useApi(roleApi.getMany, { scope, scopeId, module });
  const [role, setRole] = useState<RoleResponse>();
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;

  useEffect(() => {
    if (data) {
      setRole(data?.items[0]);
    }
  }, [data]);

  if (role && data) {
    return (
      <ApiTable
        api={roleUserApi.getMany}
        apiParams={{ roleId: role.id, scopeId, module }}
        header={
          <Select
            value={role.id.toString()}
            onChange={(value) =>
              value &&
              setRole(data.items.find((i) => i.id.toString() === value))
            }
            data={data.items.map((item) => ({
              value: item.id.toString(),
              label: item.name,
            }))}
          />
        }
        headerActions={[
          {
            label: tCore('add'),
            icon: IconPlus,
            modal: {
              title: t('addRole'),
              children: (
                <ApiFormGroup
                  api={userRoleApi.create}
                  apiParams={{ roleId: role.id, scopeId, module }}
                  fields={[
                    {
                      name: 'userId',
                      input: <userService.input label={t('user')} />,
                    },
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
        cellActions={(item) => [
          {
            label: tCore('delete'),
            icon: IconTrash,
            modal: (closeModal) => ({
              title: t('deleteUserRole', { role: role.name }),
              children: (
                <ApiConfirmFormGroup
                  api={userRoleApi.delete}
                  apiParams={{
                    roleId: role.id,
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
