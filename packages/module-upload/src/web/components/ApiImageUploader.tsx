import { CloseButton, Button } from '@mantine/core';
import { IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { ApiForm } from '@roxavn/core/web';
import { useEffect, useState } from 'react';

import { UploadFileApi } from '../../share';
import { webModule } from '../module';
import {
  ApiFileInput,
  ApiFileInputProps,
  UploadeditemProps,
  UploaditemProps,
} from './ApiFileInput';
import { useApiFileInputStyles } from './ApiFileInput.styles';

const UploadedImageitem = ({ value, onRemove }: UploadeditemProps) => {
  const { classes } = useApiFileInputStyles();

  return value ? (
    <div className={classes.container}>
      <CloseButton onClick={() => onRemove()} className={classes.closeButton} />
      <div
        className={classes.content}
        style={{ backgroundImage: `url(${value.url})` }}
      ></div>
    </div>
  ) : null;
};

const UploadImageItem = ({ value, onChange }: UploaditemProps) => {
  const { t } = webModule.useTranslation();
  const [image, setImage] = useState<string>();
  const { classes } = useApiFileInputStyles();

  useEffect(() => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(value);
    fileReader.onload = () => {
      setImage(fileReader.result as string);
    };
  }, [value]);

  return (
    <div
      className={classes.container}
      style={image ? { backgroundImage: `url('${image}')` } : {}}
    >
      <ApiForm
        api={webModule.api(UploadFileApi)}
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
          </>
        )}
      />
    </div>
  );
};

export const ApiImageUploader = <Multiple extends boolean = false>(
  props: ApiFileInputProps<Multiple>
) => {
  return (
    <ApiFileInput
      accept={IMAGE_MIME_TYPE}
      {...props}
      uploadItemTemplate={(props) => <UploadImageItem {...props} />}
      uploadedItemTemplate={(props) => <UploadedImageitem {...props} />}
    />
  );
};
