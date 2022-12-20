import { Button, ButtonProps } from '@mantine/core';
import { IconPlus, IconSend } from '@tabler/icons';

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
