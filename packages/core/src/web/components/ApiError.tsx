import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

export const ApiError = ({ error }: { error: any }): React.ReactElement => {
  let message: string;
  if ('message' in error) {
    message = error.message;
  } else if ('i18n' in error) {
    const data = error.i18n.default;
    const { t } = useTranslation([data.ns]);
    message = t(data.key, data.params) as any;
  } else {
    message = JSON.stringify(error);
  }
  return <Fragment>{message}</Fragment>;
};
