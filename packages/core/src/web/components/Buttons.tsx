import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons';

import { webModule } from '../services';

export const AddButton = () => {
  const { t } = webModule.useTranslation();
  return (
    <Button leftIcon={<IconPlus />} variant="outline">
      {t('success')}
    </Button>
  );
};
