import { Flex, Group, Input } from '@mantine/core';
import React from 'react';

import { ApiRequest, ApiResponse } from '../../share';
import { ApiForm, ApiFormProps } from './ApiForm';
import { SubmitButton } from './Buttons';

export interface ApiFormGroupProps<
  Request extends ApiRequest,
  Response extends ApiResponse,
  T extends 'horizontal' | 'vertical'
> extends Omit<ApiFormProps<Request, Response>, 'formRender'> {
  layout?: T;
  submitButton?: React.ReactElement;
  fields: T extends 'horizontal'
    ? Array<React.ReactElement>
    : Array<React.ReactElement | Array<React.ReactElement>>;
}

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
      formRender={(form) => {
        const renderField = (component: React.ReactElement) => {
          const props: any = form.getInputProps(component.props.name);
          props.mb = 'md';
          props.key = component.props.name;
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
                  description={
                    (fields[0] as any).props.description ? ' ' : undefined
                  }
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
                  <Group
                    grow
                    spacing="md"
                    key={field.map((f) => f.props.name).join(' ')}
                  >
                    {field.map(renderField)}
                  </Group>
                );
              } else {
                return renderField(field);
              }
            })}
            {submitButton ? submitButton : <SubmitButton fullWidth />}
          </div>
        );
      }}
    />
  );
}
