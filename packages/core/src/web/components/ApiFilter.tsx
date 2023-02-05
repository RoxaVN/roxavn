import { Button, Group, Popover, Indicator } from '@mantine/core';
import { IconCheck, IconFilter, IconX } from '@tabler/icons';
import { useState } from 'react';
import { Api, ApiRequest, ApiResponse } from '../../share';
import { webModule } from '../services';
import { ApiFormGroup, FormGroupField } from './ApiFormGroup';

export interface ApiFilterButtonProps<
  Request extends ApiRequest,
  Response extends ApiResponse
> {
  api: Api<Request, Response>;
  fields: Array<FormGroupField<Request>>;
  onApply?: (params: Partial<Request>) => void;
}

export const ApiFilterButton = <
  Request extends ApiRequest,
  Response extends ApiResponse
>({
  fields,
  onApply,
}: ApiFilterButtonProps<Request, Response>) => {
  const { t } = webModule.useTranslation();
  const [opened, setOpened] = useState(false);
  const [filterValue, setFilterValue] = useState<Partial<Request>>({});

  return (
    <Group align="flex-end">
      <Popover
        width={400}
        trapFocus
        withArrow
        shadow="md"
        withinPortal
        opened={opened}
        onChange={setOpened}
      >
        <Popover.Target>
          <Indicator
            label={
              Object.values(filterValue).filter((v) =>
                Array.isArray(v) ? v.length && v.every((i) => i) : !!v
              ).length
            }
            showZero={false}
            dot={false}
            inline
            size={16}
          >
            <Button
              variant="outline"
              onClick={() => setOpened((o) => !o)}
              leftIcon={<IconFilter size={16} />}
            >
              {t('filter')}
            </Button>
          </Indicator>
        </Popover.Target>
        <Popover.Dropdown>
          <ApiFormGroup
            apiParams={filterValue}
            submitButton={
              <Group position="right">
                <Button
                  variant="default"
                  leftIcon={<IconX size={16} />}
                  onClick={() => setOpened(false)}
                >
                  {t('cancel')}
                </Button>
                <Button type="submit" leftIcon={<IconCheck size={16} />}>
                  {t('apply')}
                </Button>
              </Group>
            }
            onBeforeSubmit={(params) => {
              setFilterValue(params);
              setOpened(false);
              onApply && onApply(params);
              return params;
            }}
            fields={fields}
          />
        </Popover.Dropdown>
      </Popover>
      {/* {Object.entries(filterValue)
        .map(([k, value]) =>
          value.map((item, index) => (
            <Input.Wrapper
              key={k + index.toString()}
              description={filters[k].label}
            >
              <Input
                children={item.value.toString()}
                icon={ApiFilterIcons[item.operator]}
                component="span"
                rightSection={
                  <ActionIcon variant="transparent">
                    <IconX size={16} />
                  </ActionIcon>
                }
              />
            </Input.Wrapper>
          ))
        )
        .flat()} */}
    </Group>
  );
};
