import { Text } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import React from 'react';
import { Translation } from 'react-i18next';

import { ErrorResponse } from '../../base';
import { ApiError } from '../components';
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
          <ApiError error={error} />
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
