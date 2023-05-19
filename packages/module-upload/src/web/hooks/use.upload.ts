import { apiFetcher, useApi } from '@roxavn/core/web';
import { useEffect, useState } from 'react';

import {
  NotFoundUserStorageException,
  fileApi,
  fileStoageApi,
} from '../../base/index.js';

export const useUpload = (file: File) => {
  const [refeth, setRefetch] = useState(1);
  const hookData = useApi(fileApi.upload, { file, _: refeth });

  async function checkError() {
    if (hookData.error) {
      const errorResp = apiFetcher.getErrorData(hookData.error);
      if (errorResp?.type === NotFoundUserStorageException.name) {
        await apiFetcher.fetch(fileStoageApi.create);
        setRefetch(new Date().getTime());
      }
    }
  }

  useEffect(() => {
    checkError();
  }, [hookData.error]);

  return hookData;
};
