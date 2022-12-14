import { FileButton, Button, CloseButton, Text, Group } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { InferApiResponse } from '@roxavn/core/share';
import { ApiRender, uiManager } from '@roxavn/core/web';
import { Upload, FileCheck } from 'tabler-icons-react';

import { UploadFileApi } from '../../share';
import { webModule } from '../module';
import { useFileInputStyles } from './ApiFileInput.styles';

type UploadedFile = InferApiResponse<typeof UploadFileApi>;

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
  const { classes } = useFileInputStyles();

  return value ? (
    <div className={classes.container}>
      <CloseButton onClick={() => onRemove()} className={classes.closeButton} />
      <div className={classes.content}>
        <FileCheck size={32} />
      </div>
      <Text align="center" size="sm">
        {renderLabel(value.name)}
      </Text>
    </div>
  ) : null;
};

export interface UploaditemProps {
  file: File | null;
  onChange?: (result: UploadedFile | null) => void;
}

const UploadItem = ({ file, onChange }: UploaditemProps) => {
  const { t } = webModule.useTranslation();
  const { classes } = useFileInputStyles();

  return (
    file && (
      <div className={classes.container}>
        <ApiRender
          api={webModule.api(UploadFileApi)}
          apiParams={{ file }}
          onSuccess={onChange}
          useLoader
        >
          {({ error, fetcher }) => (
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
                    onClick={() => fetcher()}
                  >
                    {t('reupload')}
                  </Button>
                )}
              </div>
              <Text align="center" size="sm">
                {renderLabel(file.name)}
              </Text>
            </>
          )}
        </ApiRender>
      </div>
    )
  );
};

type ApiFileInputProps<Multiple extends boolean = false> = {
  multiple?: Multiple;
  accept?: string;
  maxFiles?: number;
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
}: ApiFileInputProps<Multiple>) => {
  const { classes } = useFileInputStyles();
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
    return (
      <FileButton
        onChange={(files) => {
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
        }}
        accept={accept}
        multiple={multiple}
      >
        {(props) => (
          <Button {...props} variant="default" className={classes.uploadButton}>
            <Upload size={32} />
          </Button>
        )}
      </FileButton>
    );
  };

  const renderItems = () => {
    const children: React.ReactNode[] = [];
    for (const item of data) {
      if (item.upload) {
        children.push(
          <Uploadeditem
            key={item.upload.name}
            value={item.upload}
            onRemove={() => {
              const newData = data.filter(
                (i) => i.upload?.name !== item.upload?.name
              );
              dataHandler.setState(newData);
              _onChange(newData);
            }}
          />
        );
      } else if (item.local) {
        children.push(
          <UploadItem
            key={item.local.name}
            file={item.local}
            onChange={(result) => {
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
            }}
          />
        );
      }
    }
    return children;
  };

  return (
    <Group>
      {renderItems()}
      {rendernput()}
    </Group>
  );
};
