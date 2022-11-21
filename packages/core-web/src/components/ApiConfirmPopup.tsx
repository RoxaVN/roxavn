import { Api, ApiResponse, ApiRequest } from '@roxavn/core-share';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import React from 'react';

import { apiFetcher } from '../services/api.fetcher';
import { uiManager } from '../services/ui';

export interface ApiConfirmPopupProps<
  Request extends ApiRequest,
  Response extends ApiResponse
> {
  api: Api<Request, Response>;
  apiParams?: Request;
  message: string;
  onSuccess?: (data: Response) => void;
  children: React.ReactElement<any>;
}

function ApiConfirmPopup<
  Request extends ApiRequest,
  Response extends ApiResponse
>({
  api,
  apiParams,
  message,
  onSuccess,
  children,
}: ApiConfirmPopupProps<Request, Response>) {
  const accept = () => {
    apiFetcher
      .fetch(api, apiParams)
      .then((data) => onSuccess && onSuccess(data))
      .catch((resp: any) => {
        const error = apiFetcher.getErrorData(resp);
        if (error) {
          uiManager.errorDialog(error);
        }
      });
  };
  const confirm = (event: React.MouseEvent<HTMLElement>) => {
    confirmPopup({
      target: event.currentTarget,
      message: message,
      icon: 'pi pi-exclamation-triangle',
      accept: accept,
    });
  };

  return (
    <>
      {React.cloneElement(children, { onClick: confirm })}
      <ConfirmPopup />
    </>
  );
}

export { ApiConfirmPopup };
