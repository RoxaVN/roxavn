import { apiFetcher, useApi } from '@roxavn/core/web';
import { useEffect, useState } from 'react';

import { fileStorageApi } from '../../base/index.js';

export const useUpload = (file: File, fileStorageid?: string) => {
  const [storageId, setStorageId] = useState(fileStorageid);
  const hookData = useApi(storageId ? fileStorageApi.upload : undefined, {
    file,
    fileStorageId: storageId,
  } as any);

  async function checkError() {
    if (!fileStorageid) {
      const resp = await apiFetcher.fetch(fileStorageApi.create);
      setStorageId(resp.id);
    }
  }
  useEffect(() => {
    checkError();
  }, [fileStorageid]);

  return hookData;
};
