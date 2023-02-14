import { Select, SelectProps } from '@mantine/core';
import { ApiInput } from '@roxavn/core/web';

import { roleApi } from '../../base';

export const ModuleRoleInput = (props: Omit<SelectProps, 'data'>) => (
  <ApiInput
    {...props}
    api={roleApi.moduleRoles}
    convertData={(items) =>
      items.map((item) => ({
        value: item.id as any,
        label: item.scope + ' ' + item.name,
      }))
    }
    fetchOnFocus
    searchKey="scope"
    onSearchChangeProp="onSearchChange"
    component={Select}
    searchable
  />
);
