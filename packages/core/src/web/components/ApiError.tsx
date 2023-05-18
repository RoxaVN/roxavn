import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { apiFetcher } from '../services/index.js';

export const ApiError = ({ error }: { error: any }): React.ReactElement => {
  let message: string;
  const errorData = apiFetcher.getErrorData(error) || error;
  if ('i18n' in errorData) {
    const data = errorData.i18n.default;
    const { t } = useTranslation([data.ns]);
    message = t(data.key, data.params) as any;
  } else if ('message' in errorData) {
    message = errorData.message;
  } else {
    message = JSON.stringify(errorData);
  }
  return <Fragment>{message}</Fragment>;
};
