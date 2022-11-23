import { Dialog, DialogTemplateType } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import React, { Component, useRef, useState } from 'react';

import { ApiTable, ApiTableProps } from './ApiTable';
import { ApiForm, ApiFormProps } from './ApiForm';
import { apiFetcher } from '../services/api.fetcher';
import { Api, ApiResponse, ApiRequest } from '../../share';

export interface DialogTriggerProps {
  dialogHeader?: DialogTemplateType;
  dialogBody: React.ReactNode;
  dialogWidth?: number;
  children: React.ReactElement<any>;
  onShow?: () => void;
  onHide?: () => void;
}

type DialogTriggerState = { visible: boolean };
class DialogTrigger extends Component<DialogTriggerProps, DialogTriggerState> {
  state: DialogTriggerState = {
    visible: false,
  };
  open = () => {
    if (this.props.onShow) {
      this.props.onShow();
    }
    this.setState({ visible: true });
  };
  hide = () => {
    this.setState({ visible: false });
    if (this.props.onHide) {
      this.props.onHide();
    }
  };
  render() {
    const { visible } = this.state;
    const { children, dialogHeader, dialogWidth, dialogBody } = this.props;
    return (
      <>
        {React.cloneElement(children, { onClick: this.open })}
        {visible && (
          <Dialog
            draggable={false}
            visible={visible}
            header={dialogHeader}
            onHide={this.hide}
            style={{ width: Math.min(dialogWidth || 500, window.innerWidth) }}
          >
            {dialogBody}
          </Dialog>
        )}
      </>
    );
  }
}

type FormFetcher<
  Request extends ApiRequest,
  Response extends ApiResponse,
  FetcherRequest extends ApiRequest,
  FetcherResponse extends ApiResponse
> = {
  api: Api<FetcherRequest, FetcherResponse>;
  apiParams?: FetcherRequest;
  genProps?: (
    data: FetcherResponse
  ) => Partial<ApiFormProps<Request, Response>>;
};
export interface FormDialogTriggerProps<
  Request extends ApiRequest,
  Response extends ApiResponse,
  FetcherRequest extends ApiRequest,
  FetcherResponse extends ApiResponse
> extends Partial<ApiFormProps<Request, Response>> {
  dialogHeader?: React.ReactNode;
  dialogWidth?: number;
  children: React.ReactElement<any>;
  /** If not define genProps, data of response is used as fieldsValue prop of ApiForm */
  formFetcher?:
    | FormFetcher<Request, Response, FetcherRequest, FetcherResponse>
    | (() => FormFetcher<Request, Response, FetcherRequest, FetcherResponse>);
}

function FormDialogTrigger<
  Request extends ApiRequest,
  Response extends ApiResponse,
  FetcherRequest extends ApiRequest,
  FetcherResponse extends ApiResponse
>({
  dialogHeader,
  dialogWidth,
  children,
  formFetcher,
  onSuccess,
  ...formProps
}: FormDialogTriggerProps<Request, Response, FetcherRequest, FetcherResponse>) {
  const toastRef = useRef<Toast>(null);
  const dialogRef = useRef<DialogTrigger>(null);
  const [loading, setLoading] = useState(false);
  const [formPropsEx, setFormPropsEx] = useState({});

  const showDialog = () => {
    if (formFetcher) {
      const fetcher =
        typeof formFetcher === 'function' ? formFetcher() : formFetcher;
      setLoading(true);
      apiFetcher.fetch(fetcher.api, fetcher.apiParams).then((data: any) => {
        const propsEx = fetcher.genProps
          ? fetcher.genProps(data)
          : { fieldsValue: data };
        setFormPropsEx(propsEx);
        setLoading(false);
      });
    }
  };
  const formSuccess = (data: Response, params: Request) => {
    dialogRef.current?.hide();
    toastRef.current?.show({
      life: 10000,
      severity: 'success',
      summary: dialogHeader,
      detail: 'success',
    });
    onSuccess && onSuccess(data, params);
  };

  return (
    <>
      <Toast ref={toastRef} position="bottom-right" />
      <DialogTrigger
        dialogHeader={dialogHeader}
        dialogWidth={dialogWidth}
        dialogBody={
          loading ? (
            <div className="my-2 text-center">
              <i className="pi pi-spin pi-spinner text-4xl" />
            </div>
          ) : (
            <div className="mt-3">
              <ApiForm
                {...({ ...formProps, ...formPropsEx } as ApiFormProps<
                  Request,
                  Response
                >)}
                onSuccess={formSuccess}
              />
            </div>
          )
        }
        onShow={showDialog}
        ref={dialogRef}
      >
        {children}
      </DialogTrigger>
    </>
  );
}

export interface TableDialogTriggerProps<
  Request extends ApiRequest,
  ResponseItem
> extends ApiTableProps<Request, ResponseItem> {
  dialogHeader?: DialogTemplateType;
  dialogWidth?: number;
  children: React.ReactElement<any>;
}
function TableDialogTrigger<Request extends ApiRequest, ResponseItem>({
  dialogHeader,
  dialogWidth,
  children,
  ...tableProps
}: TableDialogTriggerProps<Request, ResponseItem>) {
  return (
    <DialogTrigger
      dialogHeader={dialogHeader}
      dialogWidth={dialogWidth}
      dialogBody={<ApiTable {...tableProps} />}
    >
      {children}
    </DialogTrigger>
  );
}

export { DialogTrigger, FormDialogTrigger, TableDialogTrigger };
