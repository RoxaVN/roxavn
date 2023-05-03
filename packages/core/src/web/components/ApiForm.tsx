import { Alert, Box, LoadingOverlay } from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';

import { Api, ApiRequest, ApiResponse, ErrorResponse } from '../../base';
import { webModule, apiFetcher } from '../services';
import { ApiError } from './ApiError';

export interface ApiFormProps<
  Request extends ApiRequest,
  Response extends ApiResponse
> {
  formRender?: (form: UseFormReturnType<Partial<Request>>) => React.ReactNode;
  dataRender?: (props: {
    data: Response | null;
    error: any;
    loading: boolean;
    fetcher: (params: Partial<Request>) => void;
  }) => React.ReactNode;
  onBeforeSubmit?: (
    params: Partial<Request>
  ) => Promise<Partial<Request>> | Partial<Request>;
  onSuccess?: (data: Response, params: Request) => void;
  api?: Api<Request, Response, any>;
  apiParams?: Partial<Request>;
  fetchOnMount?: boolean;
}

export function ApiForm<
  Request extends ApiRequest,
  Response extends ApiResponse
>({
  api,
  apiParams,
  formRender,
  dataRender,
  fetchOnMount,
  onBeforeSubmit,
  onSuccess,
}: ApiFormProps<Request, Response>) {
  const form = useForm<Partial<Request>>({
    initialValues: apiParams,
  });
  const [data, setData] = useState<Response | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  const [errorAlert, setErrorAlert] = useState<ErrorResponse>();

  const { t } = webModule.useTranslation();

  const fetcher = async (params: Partial<Request>) => {
    setError(null);
    setLoading(true);
    setErrorAlert(undefined);
    if (onBeforeSubmit) {
      try {
        params = await onBeforeSubmit(params);
      } catch (e: any) {
        form.setErrors(e);
        return setLoading(false);
      }
    }
    if (api) {
      try {
        const result = await apiFetcher.fetch(api, params);
        setData(result);
        onSuccess && onSuccess(result, params as any);
      } catch (e: any) {
        setError(e);
        const error = apiFetcher.getErrorData(e);
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
            setErrorAlert(error);
          }
        } else {
          setErrorAlert(e);
        }
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchOnMount) {
      const timeout = setTimeout(() => fetcher(apiParams as any), 100);
      return () => clearTimeout(timeout);
    }
    return;
  }, [api, apiParams]);

  function renderError() {
    if (errorAlert) {
      return (
        <Alert
          icon={<IconAlertCircle />}
          title={t('error')}
          withCloseButton
          color="red"
          mt="md"
          onClose={() => setErrorAlert(undefined)}
        >
          <ApiError error={errorAlert} />
        </Alert>
      );
    }
    return null;
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <LoadingOverlay visible={loading} />
      <form onSubmit={form.onSubmit((params) => fetcher(params as any))}>
        {formRender && formRender(form)}
        {renderError()}
      </form>
      {dataRender && dataRender({ data, error, loading, fetcher })}
    </Box>
  );
}
