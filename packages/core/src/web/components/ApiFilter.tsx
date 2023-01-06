import { Button, Group, Popover, Select, Indicator } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import { IconCheck, IconFilter, IconX } from '@tabler/icons';
import React, { useState } from 'react';
import { Api, ApiFilter, ApiRequest, ApiResponse } from '../../share';
import { webModule } from '../services';
import { ApiFormGroup } from './ApiFormGroup';
import { ArrayInput } from './ArrayInput';

export const ApiFilterIcons: Record<string, React.ReactNode> = {
  [ApiFilter.STARTS_WITH]: '*_',
  [ApiFilter.ENDS_WITH]: '_*',
  [ApiFilter.CONTAINS]: '*',
  [ApiFilter.NOT_CONTAINS]: '!*',
  [ApiFilter.EQUALS]: '=',
  [ApiFilter.NOT_EQUALS]: '!=',
  [ApiFilter.IN]: '∈',
  [ApiFilter.LESS_THAN]: '<',
  [ApiFilter.LESS_THAN_OR_EQUAL_TO]: '<=',
  [ApiFilter.GREATER_THAN]: '>',
  [ApiFilter.GREATER_THAN_OR_EQUAL_TO]: '>=',
};

export interface ApiFilterButtonProps<
  Request extends ApiRequest,
  Response extends ApiResponse
> {
  api: Api<Request, Response>;
  filters: {
    [k in keyof Partial<Request>]: {
      label: React.ReactNode;
      filterInput: React.ReactElement;
    };
  };
  onApply?: (params: Request) => void;
}

type FilterValue = Record<string, { operator: string; value: string }[]>;

export const ApiFilterButton = <
  Request extends ApiRequest,
  Response extends ApiResponse
>({
  api,
  filters,
  onApply,
}: ApiFilterButtonProps<Request, Response>) => {
  const { t } = webModule.useTranslation();
  const [opened, setOpened] = useState(false);
  const [filterValue, setFilterValue] = useSetState<FilterValue>({});
  const filtersValidator = api.validator?.__filters__ || {};

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
            label={Object.values(filterValue).flat().length}
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
            onBeforeSubmit={(params: FilterValue) => {
              const newFilterValue: FilterValue = {};
              const newFilterParams: any = {};
              Object.entries(params).map(([k, value]) => {
                newFilterValue[k] = value.filter((v) => v.operator && v.value);
                newFilterParams[k] = newFilterValue[k].map(
                  (v) => v.operator + ':' + v.value
                );
              });
              setFilterValue(newFilterValue);
              setOpened(false);
              onApply && onApply(newFilterParams);
              return params;
            }}
            fields={Object.entries(filters).map(([key, value]) => {
              const filter: string[] = filtersValidator[key];
              if (!filter) {
                throw Error(
                  `ApiFilterButton api ${api.path} not define filter for ${key}`
                );
              }
              return (
                <ArrayInput
                  name={key}
                  label={value.label}
                  fields={[
                    <Select
                      name="operator"
                      placeholder={t('operator')}
                      data={filter.map((f) => ({
                        value: f,
                        label: t('Filter.' + f),
                      }))}
                    />,
                    React.cloneElement(value.filterInput, { name: 'value' }),
                  ]}
                  min={1}
                  max={filter.length === 1 ? 1 : undefined}
                />
              );
            })}
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
