import React, { useState } from 'react';
import { Modal, ModalProps } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';

import { webModule } from '../services';

type ModalTriggerTemplate = (props: {
  opened: boolean;
  setOpened: (state: boolean) => void;
}) => React.ReactElement<any>;

export interface ModalTriggerProps
  extends Omit<ModalProps, 'children' | 'opened'> {
  children: React.ReactElement<any> | ModalTriggerTemplate;
  content: React.ReactNode | ModalTriggerTemplate;
}

export const ModalTrigger = ({
  children,
  content,
  ...modalProps
}: ModalTriggerProps) => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      {typeof children === 'function'
        ? children({ opened, setOpened })
        : React.cloneElement(children, { onClick: () => setOpened(true) })}
      {opened && (
        <Modal {...modalProps} opened={opened}>
          {typeof content === 'function'
            ? content({ opened, setOpened })
            : content}
        </Modal>
      )}
    </>
  );
};

type FormModalTriggerTemplate = (props: {
  opened: boolean;
  setOpened: (state: boolean) => void;
  successHandler: () => void;
}) => React.ReactElement<any>;

export interface FormModalTriggerProps
  extends Omit<ModalTriggerProps, 'content'> {
  content: React.ReactElement<any> | FormModalTriggerTemplate;
}

export const FormModalTrigger = ({
  content,
  ...modalProps
}: FormModalTriggerProps) => {
  const { t } = webModule.useTranslation();

  return (
    <ModalTrigger
      {...modalProps}
      content={({ opened, setOpened }) => {
        const successHandler = () => {
          setOpened(false);
          showNotification({
            autoClose: 10000,
            title: modalProps.title,
            message: t('success'),
            color: 'green',
            icon: <IconCheck />,
          });
        };
        return typeof content === 'function'
          ? content({ opened, setOpened, successHandler })
          : React.cloneElement(content, { onSuccess: successHandler });
      }}
    />
  );
};
