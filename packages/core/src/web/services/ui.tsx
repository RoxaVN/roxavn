import { Text } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { openConfirmModal, openModal, closeModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';
import React from 'react';
import { Translation } from 'react-i18next';

import { ErrorResponse } from '../../share';
import { webModule } from './module';

const uiManager = {
  formDialog(title: React.ReactNode, content: React.ReactElement) {
    const modalId = randomId();
    openModal({
      modalId,
      title: title,
      children: React.cloneElement(content, {
        onSuccess: (...args: any) => {
          showNotification({
            autoClose: 10000,
            title: title,
            message: (
              <Translation ns={webModule.escapedName}>
                {(t) => t('success')}
              </Translation>
            ),
            color: 'green',
            icon: <IconCheck />,
          });
          closeModal(modalId);
          content.props.onSuccess?.apply(content, args);
        },
      }),
    });
  },
  alertDialog(message: React.ReactNode, title?: React.ReactNode) {
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
  errorDialog(error: ErrorResponse | Error, title?: React.ReactNode) {
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
