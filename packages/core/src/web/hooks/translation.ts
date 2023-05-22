import { useTranslation } from 'react-i18next';

import { constants } from '../../base/index.js';

export const useMetaTranslation = () => {
  return useTranslation(constants.META_I18N_NAMESPACE);
};
