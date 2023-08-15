import {
  Button,
  CopyButton as MantineCopyButton,
  Tooltip,
  ActionIcon,
  ButtonProps,
  ModalProps,
  DrawerProps,
  Drawer,
} from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { closeModal, openModal } from '@mantine/modals';
import { PolymorphicComponentProps } from '@mantine/utils';
import { useNavigate } from '@remix-run/react';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { useMemo, useState } from 'react';

import { webModule } from '../services/index.js';
import { IfCanAccessApi, IfCanAccessApiProps } from './ApiPermission.js';
import { constants } from '../../base/index.js';

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
type _DrawerProps = Omit<DrawerProps, 'opened' | 'onClose'>;

export interface PermissionButtonProps {
  label: React.ReactNode;
  icon?: React.ComponentType<{
    size?: number | string;
    stroke?: number | string;
  }>;
  onClick?: () => void;
  access?: Omit<IfCanAccessApiProps, 'children'>;
  modal?:
    | _ModalProps
    | ((args: {
        closeModal: () => void;
        navigate: (to?: string) => void;
      }) => _ModalProps);
  drawer?:
    | _DrawerProps
    | ((args: {
        closeDrawer: () => void;
        navigate: (to?: string) => void;
      }) => _DrawerProps);
  modalMiddleware?: (closeModal: () => void, modalProps: _ModalProps) => void;
  link?: { href: string };
}

export const PermissionButton = ({
  label,
  icon,
  modal,
  drawer,
  link,
  access,
  onClick,
  modalMiddleware,
  ...props
}: PermissionButtonProps & ButtonMantineProps) => {
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [modalId, modalProps] = useMemo(() => {
    const id = randomId();
    const closeFn = () => {
      closeModal(id);
    };
    let _modalProps: _ModalProps | undefined;
    if (modal) {
      _modalProps =
        typeof modal === 'function'
          ? modal({
              closeModal: closeFn,
              navigate: (to?: string) => {
                closeFn();
                // wait cache is expired
                setTimeout(() => {
                  navigate(to || '.');
                }, constants.QUERY_CACHE_DURATION);
              },
            })
          : modal;
      if (modalMiddleware) {
        modalMiddleware(closeFn, _modalProps);
      }
    }
    return [id, _modalProps];
  }, [modal]);
  const drawerProps = useMemo(() => {
    return typeof drawer === 'function'
      ? drawer({
          closeDrawer: () => setOpenDrawer(false),
          navigate: (to?: string) => {
            setOpenDrawer(false);
            // wait cache is expired
            setTimeout(() => {
              navigate(to || '.');
            }, constants.QUERY_CACHE_DURATION);
          },
        })
      : drawer;
  }, [drawer]);

  const Icon = icon;

  return (
    <IfCanAccessApi
      {...{
        ...((modalProps?.children || drawerProps?.children) as any)?.props,
        ...access,
      }}
    >
      {drawerProps && (
        <Drawer
          position="right"
          size="xl"
          {...drawerProps}
          opened={openDrawer}
          onClose={() => setOpenDrawer(false)}
        />
      )}
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
                } else if (drawerProps) {
                  setOpenDrawer(true);
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
