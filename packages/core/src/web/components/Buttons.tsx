import {
  Button,
  CopyButton as MantineCopyButton,
  Tooltip,
  ActionIcon,
  ButtonProps,
} from '@mantine/core';
import { PolymorphicComponentProps } from '@mantine/utils';
import {
  IconPlus,
  IconSend,
  IconCopy,
  IconCheck,
  IconSearch,
} from '@tabler/icons';

import { webModule } from '../services';

type ButtonMantineProps<C = 'button'> = PolymorphicComponentProps<
  C,
  ButtonProps
>;

export const AddButton = (props: ButtonMantineProps) => {
  const { t } = webModule.useTranslation();
  return (
    <Button leftIcon={<IconPlus size={16} />} variant="outline" {...props}>
      {t('add')}
    </Button>
  );
};

export const SubmitButton = (props: ButtonMantineProps) => {
  const { t } = webModule.useTranslation();
  return (
    <Button type="submit" leftIcon={<IconSend size={16} />} {...props}>
      {t('submit')}
    </Button>
  );
};

export const SearchButton = (props: ButtonMantineProps) => {
  const { t } = webModule.useTranslation();
  return (
    <Button type="submit" leftIcon={<IconSearch size={16} />} {...props}>
      {t('search')}
    </Button>
  );
};

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
