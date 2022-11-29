import { LoadingOverlay, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useState } from 'react';
import { IconSend } from '@tabler/icons';
import { Api, ApiRequest, ApiResponse } from '../../share';
import { apiFetcher } from '../services/api.fetcher';
import { webModule } from '../services/module';

export interface ApiFormProps<
  Request extends ApiRequest,
  Response extends ApiResponse
> {
  fields: Array<React.ReactElement<any>>;
  type?: 'vertical' | 'inline';
  onBeforeSubmit?: (
    params: Partial<Request> & Record<string, any>
  ) => Partial<Request>;
  onSuccess?: (data: Response, params: Request) => void;
  api?: Api<Request, Response, any>;
  renderSubmit?: () => React.ReactNode;
}

export function ApiForm<
  Request extends ApiRequest,
  Response extends ApiResponse
>({
  fields,
  onBeforeSubmit,
  onSuccess,
  api,
  renderSubmit,
}: ApiFormProps<Request, Response>) {
  const form = useForm({});
  const [submitting, setSubmitting] = useState(false);
  const { t } = webModule.useTranslation();

  const _rendersubmit = () => {
    if (renderSubmit) {
      return renderSubmit();
    }
    if (api) {
      return (
        <Group position="center" mt="md">
          <Button type="submit" leftIcon={<IconSend />}>
            {t('submit')}
          </Button>
        </Group>
      );
    }
    return null;
  };

  return (
    <div>
      <LoadingOverlay visible={submitting} />
      <form
        onSubmit={form.onSubmit((values) => {
          if (api) {
            setSubmitting(true);
            if (onBeforeSubmit) {
              try {
                values = onBeforeSubmit(values as Partial<Request>);
              } catch (e: any) {
                setSubmitting(false);
                form.setErrors(e);
              }
            }
            apiFetcher
              .fetch(api, values)
              .then((data) => {
                setSubmitting(false);
                onSuccess && onSuccess(data, values as Request);
              })
              .catch((resp: any) => {
                setSubmitting(false);
                const error = apiFetcher.getErrorData(resp);
                if (error) {
                  if (error.type === 'ValidationException') {
                    form.setErrors(error.metadata);
                  }
                }
              });
          }
        })}
      >
        {fields.map((field) => {
          const name = field.props.name;
          if (name) {
            const attrs = form.getInputProps(name);
            attrs.value = attrs.value || '';
            attrs.key = name;
            attrs.mt = 'md';
            return React.cloneElement(field, attrs);
          }
          return field;
        })}
        {_rendersubmit()}
      </form>
    </div>
  );
}
