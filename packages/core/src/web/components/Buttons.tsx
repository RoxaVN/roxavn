import {
  Button,
  CopyButton as MantineCopyButton,
  Tooltip,
  ActionIcon,
  ButtonProps,
} from '@mantine/core';
import {
  IconPlus,
  IconSend,
  IconCopy,
  IconCheck,
  IconSearch,
} from '@tabler/icons';

import { webModule } from '../services';

export const AddButton = (props: ButtonProps) => {
  const { t } = webModule.useTranslation();
  return (
    <Button leftIcon={<IconPlus />} variant="outline" {...props}>
      {t('add')}
    </Button>
  );
};

export const SubmitButton = (props: ButtonProps) => {
  const { t } = webModule.useTranslation();
  return (
    <Button mb="md" type="submit" leftIcon={<IconSend />} {...props}>
      {t('submit')}
    </Button>
  );
};

export const SearchButton = (props: ButtonProps) => {
  const { t } = webModule.useTranslation();
  return (
    <Button type="submit" leftIcon={<IconSearch />} {...props}>
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
