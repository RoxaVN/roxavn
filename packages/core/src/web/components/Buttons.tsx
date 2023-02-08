import {
  Button,
  CopyButton as MantineCopyButton,
  Tooltip,
  ActionIcon,
  ButtonProps,
  ModalProps,
} from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { closeModal, openModal } from '@mantine/modals';
import { PolymorphicComponentProps } from '@mantine/utils';
import { IconCopy, IconCheck } from '@tabler/icons';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { webModule } from '../services';
import { IfCanAccessApi, IfCanAccessApiProps } from './ApiPermission';

type ButtonMantineProps<C = 'button'> = PolymorphicComponentProps<
  C,
  ButtonProps
>;

export const CopyButton = ({ value }: { value: string }) => {
  const { t } = webModule.useTranslation();
  return (
    <MantineCopyButton value={value} timeout={2000}>
      {({ copied, copy }) => (
        <Tooltip
          label={copied ? t('copied') : t('copy')}
          withArrow
          position="right"
        >
          <ActionIcon color={copied ? 'green' : 'gray'} onClick={copy}>
            {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
          </ActionIcon>
        </Tooltip>
      )}
    </MantineCopyButton>
  );
};

type _ModalProps = Omit<ModalProps, 'opened' | 'onClose'>;

export interface ActionProps {
  label: React.ReactNode;
  icon?: React.ComponentType<{
    size?: number | string;
    stroke?: number | string;
  }>;
  onClick?: () => void;
  access?: Omit<IfCanAccessApiProps, 'children'>;
  modal?: _ModalProps | ((closeModal: () => void) => _ModalProps);
  modalMiddleware?: (closeModal: () => void, modalProps: _ModalProps) => void;
  link?: { href: string };
}

export const ActionButton = ({
  label,
  icon,
  modal,
  link,
  access,
  onClick,
  modalMiddleware,
  ...props
}: ActionProps & ButtonMantineProps) => {
  const navigate = useNavigate();
  const [modalId, modalProps] = useMemo(() => {
    const id = randomId();
    const closeFn = () => {
      closeModal(id);
    };
    let _modalProps: _ModalProps | undefined;
    if (modal) {
      _modalProps = typeof modal === 'function' ? modal(closeFn) : modal;
      if (modalMiddleware) {
        modalMiddleware(closeFn, _modalProps);
      }
    }
    return [id, _modalProps];
  }, [modal]);
  const Icon = icon;

  return (
    <IfCanAccessApi {...{ ...(modalProps?.children as any)?.props, ...access }}>
      <Button
        leftIcon={Icon && <Icon size={16} />}
        {...props}
        onClick={
          onClick
            ? onClick
            : () => {
                if (modalProps) {
                  openModal({
                    modalId: modalId,
                    closeOnClickOutside: false,
                    ...modalProps,
                  });
                } else if (link) {
                  navigate(link.href);
                }
              }
        }
      >
        {label}
      </Button>
    </IfCanAccessApi>
  );
};
