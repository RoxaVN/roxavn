import { Text } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import React from 'react';
import { Translation } from 'react-i18next';

import { ErrorResponse } from '../../base';
import { webModule } from './module';

const uiManager = {
  alertModal(message: React.ReactNode, title?: React.ReactNode) {
    openConfirmModal({
      title: title || (
        <Translation ns={webModule.escapedName}>
          {(t) => t('notification')}
        </Translation>
      ),
      children: message,
      labels: {
        confirm: (
          <Translation ns={webModule.escapedName}>
            {(t) => t('accept')}
          </Translation>
        ),
        cancel: '',
      },
      cancelProps: { hidden: true },
    });
  },
  errorModal(error: ErrorResponse | Error, title?: React.ReactNode) {
    openConfirmModal({
      title: title || (
        <Translation ns={webModule.escapedName}>
          {(t) => t('error')}
        </Translation>
      ),
      children: (
        <Text size="sm">
          {'message' in error ? (
            error.message
          ) : (
            <Translation ns={error.i18n.default.ns}>
              {(t) => t(error.i18n.default.key, error.i18n.default.params)}
            </Translation>
          )}
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
