import { CloseButton, LoadingOverlay, Tooltip } from '@mantine/core';
import { IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { ApiError } from '@roxavn/core/web';
import { useEffect, useState } from 'react';

import {
  ApiFileInput,
  ApiFileInputProps,
  UploadeditemProps,
  UploaditemProps,
} from './ApiFileInput.js';
import { useUpload } from '../hooks/index.js';
import { useApiFileInputStyles } from './ApiFileInput.styles.js';

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
  const [image, setImage] = useState<string>();
  const { data, error, loading } = useUpload(value);
  const { classes } = useApiFileInputStyles();

  useEffect(() => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(value);
    fileReader.onload = () => {
      setImage(fileReader.result as string);
    };
  }, [value]);

  useEffect(() => {
    if (data) {
      onChange && onChange(data);
    }
  }, [data]);

  const result = (
    <div
      className={classes.container + (error ? ' ' + classes.error : '')}
      style={image ? { backgroundImage: `url('${image}')` } : {}}
    >
      <LoadingOverlay visible={loading} />
      <CloseButton
        onClick={() => onChange && onChange(null)}
        className={classes.closeButton}
      />
      <div className={classes.content}></div>
    </div>
  );

  if (error) {
    return <Tooltip label={<ApiError error={error} />}>{result}</Tooltip>;
  }
  return result;
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
