import { Formik, FieldArray, getIn, setIn, FormikErrors } from 'formik';
import isEmpty from 'lodash/isEmpty';
import { BlockUI } from 'primereact/blockui';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import React from 'react';

import { Api, ApiResponse, ApiRequest } from '../../share';
import { apiFetcher } from '../services/api.fetcher';
import { uiManager } from '../services/ui';

export interface FieldItemProps {
  name: string;
  label?: string | React.ReactNode;
  type?: React.ReactElement<any>;
  fields?: Array<FieldItemProps>;
}
type FieldItems = Array<FieldItemProps | Array<FieldItemProps>>;

export interface ApiFormProps<
  Request extends ApiRequest,
  Response extends ApiResponse
> {
  fields: FieldItems;
  fieldsValue?: Partial<Request>;
  validate?: (
    values: Partial<Request>
  ) => void | FormikErrors<Request> | Promise<FormikErrors<Request>>;
  parseParams?: (
    params: Partial<Request> & Record<string, any>
  ) => Partial<Request>;
  onSuccess?: (data: Response, params: Request) => void;
  type?: 'vertical' | 'inline';
  api?: Api<Request, Response, any>;
  renderFooter?: () => React.ReactNode;
}

const renderVertical = (
  fields: FieldItems,
  renderField: (field: FieldItemProps, className?: string) => React.ReactNode,
  renderSubmit: () => React.ReactNode
) => {
  return (
    <div>
      {fields.map((field) =>
        Array.isArray(field) ? (
          <div className="grid" key={field[0]?.name}>
            {field.map((f) => renderField(f, 'col p-fluid'))}
          </div>
        ) : (
          renderField(field, 'p-fluid')
        )
      )}
      <div className="field p-fluid">{renderSubmit()}</div>
    </div>
  );
};

const renderInline = (
  fields: FieldItems,
  renderField: (field: FieldItemProps) => React.ReactNode,
  renderSubmit: () => React.ReactNode
) => {
  return (
    <div className="formgroup-inline">
      {fields.map((field) => {
        if (Array.isArray(field)) {
          throw Error('Not support array type in inline mode');
        }
        return renderField(field);
      })}
      <div className="field py-2">{renderSubmit()}</div>
    </div>
  );
};

function ApiForm<Request extends ApiRequest, Response extends ApiResponse>({
  fields,
  fieldsValue,
  validate,
  parseParams,
  onSuccess,
  type,
  api,
  renderFooter,
}: ApiFormProps<Request, Response>) {
  return (
    <Formik
      initialValues={fieldsValue || {}}
      validate={validate}
      onSubmit={(values, { setSubmitting, setErrors }) => {
        if (api) {
          if (parseParams) {
            try {
              values = parseParams(values);
            } catch (e: any) {
              setSubmitting(false);
              return setErrors(e);
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
                  let errors = {};
                  Object.entries(error.metadata).map(([key, value]) => {
                    errors = setIn(errors, key, value);
                  });
                  setErrors(errors);
                } else {
                  uiManager.errorDialog(error);
                }
              }
            });
        }
      }}
    >
      {({ isSubmitting, values, errors, handleSubmit, handleChange }) => {
        let setError = false;
        const renderField = (field: FieldItemProps, className?: string) => {
          const value = getIn(values, field.name, '');
          const error = getIn(errors, field.name);
          const subFields = field.fields;
          if (subFields) {
            return (
              <FieldArray name={field.name} key={field.name}>
                {({ remove, push }) => (
                  <div>
                    {value.length > 0 &&
                      value.map((item: any, index: number) => (
                        <div className="formgroup-inline" key={index}>
                          {subFields.length
                            ? subFields.map((f) =>
                                renderField({
                                  ...f,
                                  name: `${field.name}.${index}.${f.name}`,
                                })
                              )
                            : renderField({
                                name: `${field.name}.${index}`,
                                label: field.label,
                                type: field.type,
                              })}
                          <div className="field py-2">
                            <Button
                              className="p-button-outlined p-button-danger"
                              onClick={() => remove(index)}
                              icon="pi pi-times"
                              type="button"
                            />
                          </div>
                        </div>
                      ))}
                    <div className="field pb-2">
                      <Button
                        className="p-button-outlined"
                        onClick={() => push(subFields.length ? {} : '')}
                        type="button"
                      >
                        <i className="pi pi-plus mr-2" /> {field.label}
                      </Button>
                    </div>
                  </div>
                )}
              </FieldArray>
            );
          }
          const attrs: Partial<any> = {
            name: field.name,
            value: value,
            onChange: handleChange,
          };
          if (typeof error === 'string') {
            attrs.className = 'p-invalid';
            setError = true;
          }
          return (
            <div className={`field py-2 ${className || ''}`} key={field.name}>
              <span className="p-float-label">
                {React.cloneElement(field.type || <InputText />, attrs)}
                {field.label && (
                  <label className={typeof error === 'string' ? 'p-error' : ''}>
                    {field.label}
                  </label>
                )}
              </span>
              {typeof error === 'string' && (
                <div>
                  <small className="p-error">{error}</small>
                </div>
              )}
            </div>
          );
        };
        const renderSubmit = () => {
          if (renderFooter) {
            return renderFooter();
          }
          if (api) {
            return <Button type="submit" label={'submit'} icon="pi pi-send" />;
          }
          return null;
        };
        return (
          <BlockUI
            blocked={isSubmitting}
            template={<i className="pi pi-spin pi-spinner text-4xl" />}
          >
            <form onSubmit={handleSubmit}>
              {type === 'inline'
                ? renderInline(fields, renderField, renderSubmit)
                : renderVertical(fields, renderField, renderSubmit)}
            </form>
            {!setError && !isEmpty(errors) && (
              <Message
                className="field"
                severity="error"
                content={
                  <pre className="my-0">{JSON.stringify(errors, null, 2)}</pre>
                }
              />
            )}
          </BlockUI>
        );
      }}
    </Formik>
  );
}

export { ApiForm };
