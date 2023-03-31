import { ActionIcon, Box, BoxProps, Button, Flex, Input } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { randomId, useListState } from '@mantine/hooks';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import get from 'lodash/get';
import React, { useEffect } from 'react';
import { webModule } from '../services';

export interface ArrayInputProps extends BoxProps {
  fields: Array<React.ReactElement> | React.ReactElement;
  name?: string;
  form?: UseFormReturnType<any>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  required?: boolean;
  min?: number;
  max?: number;
}

export const ArrayInput = ({
  label,
  description,
  required,
  form,
  name = '',
  fields,
  min,
  max,
  ...props
}: ArrayInputProps) => {
  const { t } = webModule.useTranslation();
  const [ids, IdsHandler] = useListState<string>(
    Array.from(
      { length: (form && get(form.values, name)?.length) || 0 },
      randomId
    )
  );

  useEffect(() => {
    if (form && min) {
      const value = get(form.values, name);
      const currentLength: number = value?.length || 0;
      add(form, min - currentLength);
    }
  }, [min]);

  const add = (formIns: UseFormReturnType<any>, quantity: number) => {
    const value = get(formIns.values, name);
    const newValue = Array.from({ length: quantity }, () =>
      Array.isArray(fields) ? {} : ''
    );
    IdsHandler.append(...newValue.map(() => randomId()));
    if (value) {
      formIns.setFieldValue(name, value.concat(newValue));
    } else {
      formIns.setFieldValue(name, newValue);
    }
  };

  const remove = (formIns: UseFormReturnType<any>, index: number) => {
    formIns.removeListItem(name, index);
    IdsHandler.remove(index);
  };

  const cloneField = (
    formIns: UseFormReturnType<any>,
    f: React.ReactElement,
    nameProp: string
  ) => {
    const props: any = formIns.getInputProps(nameProp);
    props.value = props.value === undefined ? '' : props.value;
    props.key = f.props.name;
    props.sx = { flex: 1 };
    props.mb = 'xs';
    return React.cloneElement(f, props);
  };

  const renderFields = (formIns: UseFormReturnType<any>) => {
    const value = get(formIns.values, name);
    return (
      <Box mt="sm">
        {value?.map((item: any, index: number) => (
          <Flex
            justify="flex-start"
            align="start"
            direction="row"
            gap="xs"
            wrap="wrap"
            key={ids[index]}
          >
            {Array.isArray(fields)
              ? fields.map((f) =>
                  cloneField(
                    formIns,
                    f,
                    name + '.' + index + '.' + f.props.name
                  )
                )
              : cloneField(formIns, fields, name + '.' + index)}
            {(!min || min < value.length) && (
              <ActionIcon onClick={() => remove(formIns, index)}>
                <IconTrash size={16} />
              </ActionIcon>
            )}
          </Flex>
        ))}
        {(!max || !value || max > value.length) && (
          <Button
            leftIcon={<IconPlus size={16} />}
            variant="outline"
            onClick={() => add(formIns, 1)}
          >
            {t('add')}
          </Button>
        )}
      </Box>
    );
  };
  if (!form) {
    throw Error('ArrayInput: must set form prop');
  }

  return (
    <Box {...props}>
      <div>
        {label && <Input.Label required={required}>{label}</Input.Label>}
        {description && <Input.Description>{description}</Input.Description>}
      </div>
      {renderFields(form)}
    </Box>
  );
};
