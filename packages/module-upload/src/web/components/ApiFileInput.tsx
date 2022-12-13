import {
  LoadingOverlay,
  FileButton,
  Button,
  CloseButton,
  Box,
} from '@mantine/core';
import { InferApiResponse } from '@roxavn/core/share';
import { apiFetcher } from '@roxavn/core/web';
import { useEffect, useState } from 'react';
import { Upload } from 'tabler-icons-react';

import { UploadFileApi } from '../../share';
import { webModule } from '../module';

const size = { width: 100, height: 100 };

type UploadedFile = InferApiResponse<typeof UploadFileApi> | null | undefined;

const renderLabel = (fileName: string) => {
  const parts = fileName.split('.');
  return (
    <>
      {parts[0].length > 10 ? `${parts[0].slice(0, 10)}...` : parts[0]}
      <br />
      {parts[1] && `.${parts[1]}`}
    </>
  );
};

const Uploadeditem = ({
  value,
  onRemove,
}: {
  value: UploadedFile;
  onRemove: () => void;
}) => {
  return value ? (
    <Box
      sx={(theme) => ({
        ...size,
        position: 'relative',
        border: `1px dashed ${theme.fn.variant({ variant: 'default' }).border}`,
      })}
    >
      <CloseButton
        onClick={() => onRemove()}
        style={{ position: 'absolute', top: 0, right: 0 }}
      />
      <div
        style={{
          position: 'absolute',
          top: '60%',
          left: '50%',
          width: size.width,
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        {renderLabel(value.name)}
      </div>
    </Box>
  ) : null;
};

const UploadItem = ({
  file,
  onChange,
}: {
  file: File | null;
  onChange?: (result: UploadedFile) => void;
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (file) {
      apiFetcher
        .fetch(webModule.api(UploadFileApi), { file: file })
        .then((result) => {
          setLoading(false);
          onChange && onChange(result);
        })
        .catch(() => setLoading(false));
    }
  }, [file]);

  return (
    file && (
      <Box
        sx={(theme) => ({
          ...size,
          position: 'relative',
          border: `1px dashed ${
            theme.fn.variant({ variant: 'default' }).border
          }`,
        })}
      >
        <LoadingOverlay visible={loading} />
        <CloseButton
          onClick={() => onChange && onChange(null)}
          style={{ position: 'absolute', top: 0, right: 0 }}
        />
        <div
          style={{
            position: 'absolute',
            top: '60%',
            left: '50%',
            width: size.width,
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          {renderLabel(file.name)}
        </div>
      </Box>
    )
  );
};

export const ApiFileInput = ({
  value,
  onChange,
}: {
  value?: UploadedFile;
  onChange?: (value: UploadedFile) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <>
      <Uploadeditem value={value} onRemove={() => onChange && onChange(null)} />
      <UploadItem
        file={file}
        onChange={(result) => {
          setFile(null);
          onChange && onChange(result);
        }}
      />
      {!(file || value) && (
        <FileButton onChange={setFile}>
          {(props) => (
            <Button {...props} variant="default" style={size}>
              <Upload size={32} />
            </Button>
          )}
        </FileButton>
      )}
    </>
  );
};
