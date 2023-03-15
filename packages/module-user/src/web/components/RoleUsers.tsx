import { Select } from '@mantine/core';
import { InferApiRequest } from '@roxavn/core/base';
import {
  ApiFormGroup,
  utils,
  webModule as coreWebModule,
} from '@roxavn/core/web';
import { ApiTable, useApi } from '@roxavn/core/web';
import { IconPlus } from '@tabler/icons';
import { useState } from 'react';

import { roleApi, roleUserApi, userRoleApi } from '../../base';
import { webModule } from '../module';
import { userReference } from '../references';
import { UserInput } from './UserInput';

export interface RoleUsersProps {
  getRolesParams?: InferApiRequest<typeof roleApi.getMany>;
}

export const RoleUsers = ({ getRolesParams }: RoleUsersProps) => {
  const { data } = useApi(roleApi.getMany, getRolesParams);
  const [roleId, setRoleId] = useState(data && data.items[0].id);
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;

  return (
    roleId &&
    data && (
      <ApiTable
        api={roleUserApi.getMany}
        apiParams={{ roleId }}
        header={
          <Select
            value={roleId.toString()}
            onChange={(value) => value && setRoleId(parseInt(value))}
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
                  apiParams={{
                    roleId: roleId,
                    scopeId: getRolesParams?.scopeId,
                  }}
                  fields={[
                    {
                      name: 'userId',
                      input: <UserInput label={t('user')} />,
                    },
                  ]}
                />
              ),
            },
          },
        ]}
        columns={{
          id: { label: tCore('id'), reference: userReference },
          username: { label: t('username') },
          createdDate: {
            label: tCore('createdDate'),
            render: utils.Render.datetime,
          },
        }}
      />
    )
  );
};
