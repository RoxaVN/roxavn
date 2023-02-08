import { FileButton, Button, CloseButton, Text, Group } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { InferApiResponse } from '@roxavn/core/base';
import { ApiForm, uiManager } from '@roxavn/core/web';
import { IconUpload, IconFileCheck } from '@tabler/icons';
import { Fragment } from 'react';

import { uploadFileApi } from '../../base';
import { webModule } from '../module';
import { useApiFileInputStyles } from './ApiFileInput.styles';

type UploadedFile = InferApiResponse<typeof uploadFileApi>;

const renderLabel = (fileName: string) => {
  const parts = fileName.split('.');
  return (
    <>
      {parts[0].length > 6 ? `${parts[0].slice(0, 4)}...` : parts[0]}
      {parts[1] && `.${parts[1]}`}
    </>
  );
};

export interface UploadeditemProps {
  value: UploadedFile;
  onRemove: () => void;
}

const Uploadeditem = ({ value, onRemove }: UploadeditemProps) => {
  const { classes } = useApiFileInputStyles();

  return value ? (
    <div className={classes.container}>
      <CloseButton onClick={() => onRemove()} className={classes.closeButton} />
      <div className={classes.content}>
        <IconFileCheck size={32} />
      </div>
      <Text align="center" size="sm">
        {renderLabel(value.name)}
      </Text>
    </div>
  ) : null;
};

export interface UploaditemProps {
  value: File;
  onChange?: (result: UploadedFile | null) => void;
}

const UploadItem = ({ value, onChange }: UploaditemProps) => {
  const { t } = webModule.useTranslation();
  const { classes } = useApiFileInputStyles();

  return (
    <div className={classes.container}>
      <ApiForm
        api={uploadFileApi}
        apiParams={{ file: value }}
        onSuccess={onChange}
        fetchOnMount
        dataRender={({ error, fetcher }) => (
          <>
            <CloseButton
              onClick={() => onChange && onChange(null)}
              className={classes.closeButton}
            />
            <div className={classes.content}>
              {error && (
                <Button
                  variant="subtle"
                  color="red"
                  size="sm"
                  fullWidth
                  onClick={() => fetcher({})}
                >
                  {t('reupload')}
                </Button>
              )}
            </div>
            <Text align="center" size="sm">
              {renderLabel(value.name)}
            </Text>
          </>
        )}
      />
    </div>
  );
};

export type ApiFileInputProps<Multiple extends boolean = false> = {
  multiple?: Multiple;
  accept?: string | string[];
  maxFiles?: number;
  containerTemplate?: (props: { children: React.ReactNode }) => JSX.Element;
  inputTemplate?: (props: {
    onChange: (files: File | File[] | null) => void;
  }) => JSX.Element;
  uploadedItemTemplate?: (props: {
    value: UploadedFile;
    onRemove: () => void;
  }) => JSX.Element;
  uploadItemTemplate?: (props: {
    value: File;
    onChange: (value: UploadedFile | null) => void;
  }) => JSX.Element;
  value?: Multiple extends false ? UploadedFile | null : UploadedFile[];
  onChange?: (
    value: Multiple extends false ? UploadedFile | null : UploadedFile[]
  ) => void;
};

export const ApiFileInput = <Multiple extends boolean = false>({
  accept,
  value,
  onChange,
  maxFiles,
  multiple,
  inputTemplate,
  containerTemplate,
  uploadItemTemplate,
  uploadedItemTemplate,
}: ApiFileInputProps<Multiple>) => {
  const { classes } = useApiFileInputStyles();
  const { t } = webModule.useTranslation();
  const [data, dataHandler] = useListState<{
    local: File | null;
    upload: UploadedFile | null;
  }>(
    value
      ? Array.isArray(value)
        ? value.map((v) => ({
            upload: v,
            local: null,
          }))
        : [{ upload: value, local: null }]
      : []
  );

  const _onChange = (
    newData: Array<{
      local: File | null;
      upload: UploadedFile | null;
    }>
  ) => {
    if (onChange) {
      const newValue = newData
        .filter((d) => d.upload)
        .map((d) => d.upload) as UploadedFile[];
      onChange(multiple ? (newValue as any) : newValue[0] || null);
    }
  };

  const rendernput = () => {
    if (maxFiles && data.length > maxFiles) {
      return null;
    }
    if (!multiple && data.length > 0) {
      return null;
    }
    const inputOnChange = (files: File | File[] | null) => {
      if (files) {
        const newFiles: File[] = Array.isArray(files)
          ? files.filter((f) => !data.find((d) => d.local?.name === f.name))
          : [files];
        if (maxFiles && newFiles.length + data.length > maxFiles) {
          uiManager.errorDialog(
            new Error(t('Validation.MaxFiles', { count: maxFiles }))
          );
        } else {
          dataHandler.append(
            ...newFiles.map((f) => ({ local: f, upload: null }))
          );
        }
      }
    };
    return inputTemplate ? (
      inputTemplate({ onChange: inputOnChange })
    ) : (
      <FileButton
        onChange={inputOnChange}
        accept={Array.isArray(accept) ? accept.join(', ') : accept}
        multiple={multiple}
      >
        {(props) => (
          <Button {...props} variant="default" className={classes.uploadButton}>
            <IconUpload size={32} />
          </Button>
        )}
      </FileButton>
    );
  };
  const renderItems = () => {
    const children: React.ReactNode[] = [];
    for (const item of data) {
      if (item.upload) {
        const itemOnRemove = () => {
          const newData = data.filter(
            (i) => i.upload?.name !== item.upload?.name
          );
          dataHandler.setState(newData);
          _onChange(newData);
        };
        children.push(
          <Fragment key={item.upload.name}>
            {uploadedItemTemplate ? (
              uploadedItemTemplate({
                value: item.upload,
                onRemove: itemOnRemove,
              })
            ) : (
              <Uploadeditem value={item.upload} onRemove={itemOnRemove} />
            )}
          </Fragment>
        );
      } else if (item.local) {
        const itemOnChange = (result: UploadedFile | null) => {
          const index = data.findIndex(
            (i) => i.local?.name === item.local?.name
          );
          if (result) {
            data[index] = { local: item.local, upload: result };
            dataHandler.setItem(index, data[index]);
          } else {
            // remove item
            data.splice(index, 1);
            dataHandler.remove(index);
          }
          _onChange(data);
        };
        children.push(
          <Fragment key={item.local.name}>
            {uploadItemTemplate ? (
              uploadItemTemplate({ value: item.local, onChange: itemOnChange })
            ) : (
              <UploadItem value={item.local} onChange={itemOnChange} />
            )}
          </Fragment>
        );
      }
    }
    return children;
  };

  const children = (
    <>
      {rendernput()}
      {renderItems()}
    </>
  );

  return containerTemplate ? (
    containerTemplate({ children: children })
  ) : (
    <Group>{children}</Group>
  );
};
