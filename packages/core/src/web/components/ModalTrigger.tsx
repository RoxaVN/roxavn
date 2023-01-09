import React, { useState } from 'react';
import { Modal, ModalProps } from '@mantine/core';

type ModalTriggerTemplate = (props: {
  opened: boolean;
  setOpened: (state: boolean) => void;
}) => React.ReactElement<any>;

export interface ModalTriggerProps
  extends Omit<ModalProps, 'children' | 'opened' | 'onClose'> {
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
        <Modal
          closeOnClickOutside={false}
          {...modalProps}
          opened={opened}
          onClose={() => setOpened(false)}
        >
          {typeof content === 'function'
            ? content({ opened, setOpened })
            : content}
        </Modal>
      )}
    </>
  );
};
