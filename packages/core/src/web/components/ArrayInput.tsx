import { ActionIcon, Box, BoxProps, Flex, Input } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { IconTrash } from '@tabler/icons';
import get from 'lodash/get';
import React from 'react';
import { AddButton } from './Buttons';

export interface ArrayInputProps extends BoxProps {
  fields: Array<React.ReactElement> | React.ReactElement;
  name: string;
  form?: UseFormReturnType<any>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  required?: boolean;
}

export const ArrayInput = ({
  label,
  description,
  required,
  form,
  name,
  fields,
  ...props
}: ArrayInputProps) => {
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
    return get(formIns.values, name)?.map((item: any, index: number) => (
      <Flex
        justify="flex-start"
        align="start"
        direction="row"
        gap="xs"
        wrap="wrap"
        key={index}
      >
        {Array.isArray(fields)
          ? fields.map((f) =>
              cloneField(formIns, f, name + '.' + index + '.' + f.props.name)
            )
          : cloneField(formIns, fields, name + '.' + index)}
        <ActionIcon onClick={() => formIns.removeListItem(name, index)}>
          <IconTrash size={16} />
        </ActionIcon>
      </Flex>
    ));
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
      <Box mt="sm">
        {renderFields(form)}
        <AddButton
          onClick={() => {
            const value = get(form.values, name);
            if (value) {
              form.insertListItem(name, Array.isArray(fields) ? {} : '');
            } else {
              form.setFieldValue(name, Array.isArray(fields) ? [{}] : ['']);
            }
          }}
        />
      </Box>
    </Box>
  );
};
