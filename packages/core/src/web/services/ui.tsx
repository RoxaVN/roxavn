import { Text } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { openConfirmModal, openModal, closeModal } from '@mantine/modals';
import React from 'react';
import { Translation } from 'react-i18next';

import { ErrorResponse } from '../../base';
import { ApiError } from '../components';
import { webModule } from './module';

const uiManager = {
  modal({
    title,
    children,
  }: {
    title?: React.ReactNode;
    children: React.ReactNode | ((closeModal: () => void) => React.ReactNode);
  }) {
    const modalId = randomId();
    openModal({
      closeOnClickOutside: false,
      modalId: modalId,
      title: title || (
        <Translation ns={webModule.escapedName}>
          {(t) => t('notification')}
        </Translation>
      ),
      children:
        typeof children === 'function'
          ? children(() => closeModal(modalId))
          : children,
    });
  },
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
      cancelProps: { style: { display: 'none' } },
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
      cancelProps: { style: { display: 'none' } },
    });
  },
};

export { uiManager };
