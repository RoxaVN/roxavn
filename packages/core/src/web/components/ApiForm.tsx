import { LoadingOverlay } from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import React, { useState } from 'react';

import { Api, ApiRequest, ApiResponse } from '../../share';
import { uiManager, webModule, apiFetcher } from '../services';

export interface ApiFormProps<
  Request extends ApiRequest,
  Response extends ApiResponse
> {
  initialValues?: Request & Record<string, any>;
  children: (form: UseFormReturnType<Request>) => React.ReactNode;
  onBeforeSubmit?: (params: Request & Record<string, any>) => Promise<Request>;
  onSuccess?: (data: Response, params: Request) => void;
  api?: Api<Request, Response, any>;
}

export function ApiForm<
  Request extends ApiRequest,
  Response extends ApiResponse
>({
  initialValues,
  children,
  onBeforeSubmit,
  onSuccess,
  api,
}: ApiFormProps<Request, Response>) {
  const form = useForm<Request & Record<string, any>>({
    initialValues: initialValues,
  });
  const [submitting, setSubmitting] = useState(false);
  const { t } = webModule.useTranslation();

  return (
    <div>
      <LoadingOverlay visible={submitting} />
      <form
        onSubmit={form.onSubmit(async (values) => {
          if (api) {
            setSubmitting(true);
            if (onBeforeSubmit) {
              try {
                values = await onBeforeSubmit(values);
              } catch (e: any) {
                form.setErrors(e);
                return setSubmitting(false);
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
                    Object.keys(error.i18n).forEach((field) =>
                      form.setFieldError(
                        field,
                        t(error.i18n[field].key, {
                          ns: error.i18n[field].ns,
                          ...error.i18n[field].params,
                        })
                      )
                    );
                  } else {
                    uiManager.errorDialog(error);
                  }
                }
              });
          }
        })}
      >
        {children(form)}
      </form>
    </div>
  );
}
