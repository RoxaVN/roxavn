import { FileButton, Button, Group, CloseButton, Box } from '@mantine/core';
import { apiFetcher } from '@roxavn/core/web';
import { useEffect, useState } from 'react';
import { Upload } from 'tabler-icons-react';

import { UploadFileApi } from '../../share';
import { webModule } from '../module';

const UploadItem = ({ file }: { file: File; onChange?: () => void }) => {
  useEffect(() => {
    apiFetcher.fetch(webModule.api(UploadFileApi), { file: file });
  }, []);
  return (
    <Box
      sx={(theme) => ({
        position: 'relative',
        width: 100,
        height: 100,
        border: `1px dashed ${theme.fn.variant({ variant: 'default' }).border}`,
      })}
    >
      <CloseButton style={{ position: 'absolute', top: 0, right: 0 }} />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        tes
      </div>
    </Box>
  );
};

export const ApiFileInput = () => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <Group>
      {file && <UploadItem key={file.name} file={file} />}
      <FileButton onChange={setFile}>
        {(props) => (
          <Button
            {...props}
            variant="default"
            style={{ width: 100, height: 100 }}
          >
            <Upload size={32} />
          </Button>
        )}
      </FileButton>
    </Group>
  );
};
