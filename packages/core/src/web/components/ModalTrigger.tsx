import React, { useState } from 'react';
import { Modal, ModalProps } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { constants } from '../../base/index.js';

type ModalTriggerTemplate = (props: {
  opened: boolean;
  setOpened: (state: boolean) => void;
  navigate: (to?: string) => void;
}) => React.ReactElement<any>;

export interface ModalTriggerProps
  extends Omit<ModalProps, 'children' | 'opened' | 'onClose' | 'content'> {
  children: React.ReactElement<any> | ModalTriggerTemplate;
  content: React.ReactNode | ModalTriggerTemplate;
}

export const ModalTrigger = ({
  children,
  content,
  ...modalProps
}: ModalTriggerProps) => {
  const [opened, setOpened] = useState(false);
  const navigator = useNavigate();
  const navigate = (to?: string) => {
    setOpened(false);
    // wait cache is expired
    setTimeout(() => {
      navigator(to || '.');
    }, constants.QUERY_CACHE_DURATION);
  };

  return (
    <>
      {typeof children === 'function'
        ? children({ opened, setOpened, navigate })
        : React.cloneElement(children, { onClick: () => setOpened(true) })}
      {opened && (
        <Modal
          closeOnClickOutside={false}
          {...modalProps}
          opened={opened}
          onClose={() => setOpened(false)}
        >
          {typeof content === 'function'
            ? content({ opened, setOpened, navigate })
            : content}
        </Modal>
      )}
    </>
  );
};
