import { Button, ButtonProps } from '@mantine/core';
import { IconPlus } from '@tabler/icons';

import { webModule } from '../services';

export const AddButton = (props: ButtonProps) => {
  const { t } = webModule.useTranslation();
  return (
    <Button leftIcon={<IconPlus />} variant="outline" {...props}>
      {t('add')}
    </Button>
  );
};
