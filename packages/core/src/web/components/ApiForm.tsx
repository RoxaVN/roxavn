import { Box, LoadingOverlay } from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import React, { useEffect, useState } from 'react';

import { Api, ApiRequest, ApiResponse } from '../../share';
import { uiManager, webModule, apiFetcher } from '../services';

export interface ApiFormProps<
  Request extends ApiRequest,
  Response extends ApiResponse
> {
  formRender?: (form: UseFormReturnType<Request>) => React.ReactNode;
  dataRender?: (props: {
    data: Response | null;
    error: any;
    loading: boolean;
    fetcher: (params: Request) => void;
  }) => React.ReactNode;
  onBeforeSubmit?: (
    params: Request & Record<string, any>
  ) => Promise<Request> | Request;
  onSuccess?: (data: Response, params: Request) => void;
  api?: Api<Request, Response, any>;
  apiParams?: Request & Record<string, any>;
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
  const form = useForm<Request & Record<string, any>>({
    initialValues: apiParams,
  });
  const [data, setData] = useState<Response | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();

  const { t } = webModule.useTranslation();

  const fetcher = async (params: Request) => {
    setError(null);
    setLoading(true);
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
        onSuccess && onSuccess(result, params);
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
            uiManager.errorDialog(error);
          }
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

  return (
    <Box sx={{ position: 'relative' }}>
      <LoadingOverlay visible={loading} />
      <form onSubmit={form.onSubmit(fetcher)}>
        {formRender && formRender(form)}
      </form>
      {dataRender && dataRender({ data, error, loading, fetcher })}
    </Box>
  );
}
