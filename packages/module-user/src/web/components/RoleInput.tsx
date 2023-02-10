import { Select, SelectProps } from '@mantine/core';
import { ApiInput } from '@roxavn/core/web';

import { getModuleRolesApi } from '../../base';

export const ModuleRoleInput = (props: Omit<SelectProps, 'data'>) => (
  <ApiInput
    {...props}
    api={getModuleRolesApi}
    convertData={(items) =>
      items.map((item) => ({
        value: item.id as any,
        label: item.resource + ' ' + item.name,
      }))
    }
    fetchOnFocus
    searchKey="resource"
    onSearchChangeProp="onSearchChange"
    component={Select}
    searchable
  />
);
