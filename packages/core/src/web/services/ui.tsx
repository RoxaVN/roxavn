import { Text } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { Translation } from 'react-i18next';

import { ErrorResponse } from '../../share';
import { webModule } from './module';

const uiManager = {
  // alertDialog(message: string, header?: string, icon = 'pi pi-info-circle') {},
  errorDialog(error: ErrorResponse, title?: React.ReactNode) {
    openConfirmModal({
      title: title || (
        <Translation ns={webModule.escapedName}>
          {(t) => t('error')}
        </Translation>
      ),
      children: (
        <Text size="sm">
          <Translation ns={error.i18n.default.ns}>
            {(t) => t(error.i18n.default.key)}
          </Translation>
        </Text>
      ),
      labels: {
        confirm: (
          <Translation ns={webModule.escapedName}>
            {(t) => t('accept')}
          </Translation>
        ),
        cancel: '',
      },
      confirmProps: { color: 'red' },
      cancelProps: { hidden: true },
    });
  },
};

export { uiManager };
