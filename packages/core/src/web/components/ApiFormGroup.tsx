import { Flex, Group, Input } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import React from 'react';

import { ApiRequest, ApiResponse } from '../../share';
import { ApiForm, ApiFormProps } from './ApiForm';
import { SubmitButton } from './Buttons';

export interface FormGroupField<T> {
  name: keyof T;
  input: React.ReactElement;
}

export interface FormGroupProps<T extends 'horizontal' | 'vertical', V> {
  layout?: T;
  submitButton?: React.ReactElement;
  form: UseFormReturnType<Partial<V>>;
  fields: T extends 'horizontal'
    ? Array<FormGroupField<V>>
    : Array<FormGroupField<V> | Array<FormGroupField<V>>>;
}

export function FormGroup<T extends 'horizontal' | 'vertical', V>({
  layout,
  form,
  submitButton,
  fields,
}: FormGroupProps<T, V>) {
  const renderField = (name: keyof V, component: React.ReactElement) => {
    const props: any = form.getInputProps(name);
    props.mb = 'md';
    props.key = name;
    props.value = props.value === undefined ? '' : props.value;
    if (component.props.fields) {
      // auto add form for ArrayInput
      props.form = form;
    }
    return React.cloneElement(component, props);
  };

  if (layout === 'horizontal') {
    return (
      <Flex
        justify="flex-start"
        align="start"
        direction="row"
        gap="md"
        wrap="wrap"
      >
        {(fields as any).map(renderField)}
        {submitButton ? (
          submitButton
        ) : (
          <Input.Wrapper
            label={(fields[0] as any).props.label ? ' ' : undefined}
            description={(fields[0] as any).props.description ? ' ' : undefined}
          >
            <Input component={SubmitButton} />
          </Input.Wrapper>
        )}
      </Flex>
    );
  }
  return (
    <div>
      {fields.map((field) => {
        if (Array.isArray(field)) {
          return (
            <Group grow spacing="md" key={field.map((f) => f.name).join(' ')}>
              {field.map((item) => renderField(item.name, item.input))}
            </Group>
          );
        } else {
          return renderField(field.name, field.input);
        }
      })}
      {submitButton ? submitButton : <SubmitButton fullWidth />}
    </div>
  );
}

export interface ApiFormGroupProps<
  Request extends ApiRequest,
  Response extends ApiResponse,
  T extends 'horizontal' | 'vertical'
> extends Omit<ApiFormProps<Request, Response>, 'formRender'>,
    Omit<FormGroupProps<T, Request>, 'form'> {}

export function ApiFormGroup<
  Request extends ApiRequest,
  Response extends ApiResponse,
  T extends 'horizontal' | 'vertical'
>({
  layout,
  submitButton,
  fields,
  ...props
}: ApiFormGroupProps<Request, Response, T>) {
  return (
    <ApiForm
      {...props}
      formRender={(form) => (
        <FormGroup
          form={form}
          layout={layout}
          fields={fields}
          submitButton={submitButton}
        />
      )}
    />
  );
}
