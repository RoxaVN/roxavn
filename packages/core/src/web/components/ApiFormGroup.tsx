import { Button, Flex, Group, Input } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { IconSend, IconX } from '@tabler/icons';
import React from 'react';

import { ApiRequest, ApiResponse } from '../../base';
import { webModule } from '../services';
import { ApiForm, ApiFormProps } from './ApiForm';

export interface FormGroupField<T> {
  name: keyof T;
  input: React.ReactElement;
}

export interface FormGroupProps<T extends 'horizontal' | 'vertical', V> {
  layout?: T;
  header?: React.ReactElement;
  footer?: React.ReactElement;
  form: UseFormReturnType<Partial<V>>;
  fields: T extends 'horizontal'
    ? Array<FormGroupField<V>>
    : Array<FormGroupField<V> | Array<FormGroupField<V>>>;
}

export function FormGroup<T extends 'horizontal' | 'vertical', V>({
  layout,
  form,
  header,
  footer,
  fields,
}: FormGroupProps<T, V>) {
  const { t } = webModule.useTranslation();

  const renderField = (name: keyof V, component: React.ReactElement) => {
    const props: any = form.getInputProps(name);
    props.mb = 'md';
    props.key = name;
    if (
      [
        '@mantine/core/PasswordInput',
        '@mantine/core/Textarea',
        '@mantine/core/TextInput',
      ].includes((component.type as any).displayName)
    ) {
      props.value = props.value || '';
    }
    if (component.props.fields) {
      // auto add form for ArrayInput
      props.form = form;
      props.name = name;
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
        {header}
        {(fields as any).map(renderField)}
        {footer ? (
          footer
        ) : (
          <Input.Wrapper
            label={(fields[0] as any).props.label ? ' ' : undefined}
            description={(fields[0] as any).props.description ? ' ' : undefined}
          >
            <Input component="button" type="submit">
              <IconSend size={16} /> {t('submit')}
            </Input>
          </Input.Wrapper>
        )}
      </Flex>
    );
  }
  return (
    <div>
      {header}
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
      {footer ? (
        footer
      ) : (
        <Button type="submit" leftIcon={<IconSend size={16} />} fullWidth>
          {t('submit')}
        </Button>
      )}
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
  header,
  footer,
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
          header={header}
          footer={footer}
        />
      )}
    />
  );
}

export interface ApiConfirmFormGroupProps<
  Request extends ApiRequest,
  Response extends ApiResponse,
  T extends 'horizontal' | 'vertical'
> extends Omit<
    ApiFormGroupProps<Request, Response, T>,
    'header' | 'footer' | 'fields'
  > {
  onCancel: () => void;
  header?: React.ReactElement;
  footer?: React.ReactElement;
  fields?: ApiFormGroupProps<Request, Response, T>['fields'];
}

export function ApiConfirmFormGroup<
  Request extends ApiRequest,
  Response extends ApiResponse,
  T extends 'horizontal' | 'vertical'
>({
  onCancel,
  header,
  footer,
  fields,
  ...props
}: ApiConfirmFormGroupProps<Request, Response, T>) {
  const { t } = webModule.useTranslation();
  return (
    <ApiFormGroup
      {...props}
      header={header || <p>{t('confirmMessage')}</p>}
      fields={fields || []}
      footer={
        footer || (
          <Group position="right">
            <Button
              leftIcon={<IconX size={16} />}
              variant="default"
              onClick={onCancel}
            >
              {t('cancel')}
            </Button>
            <Button type="submit" leftIcon={<IconSend size={16} />}>
              {t('submit')}
            </Button>
          </Group>
        )
      }
    />
  );
}
