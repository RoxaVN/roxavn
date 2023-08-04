import {
  ApiConfirmFormGroup,
  ApiFormGroup,
  ApiTable,
  IfCanAccessApi,
  ModuleT,
  PageItem,
  webModule as coreWebModule,
  utils,
} from '@roxavn/core/web';
import {
  IconEdit,
  IconLanguage,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';

import { translationApi } from '../../base/index.js';
import { webModule } from '../module.js';
import { TextInput, Textarea } from '@mantine/core';

const Page = () => {
  const { t } = webModule.useTranslation();
  const tCore = coreWebModule.useTranslation().t;
  return (
    <ApiTable
      api={translationApi.getMany}
      header={t('translations')}
      headerActions={[
        {
          label: tCore('add'),
          icon: IconPlus,
          modal: {
            title: tCore('add'),
            children: (
              <ApiFormGroup
                api={translationApi.create}
                fields={[
                  {
                    name: 'key',
                    input: <TextInput label={tCore('id')} />,
                  },
                  {
                    name: 'lang',
                    input: <TextInput label={t('language')} />,
                  },
                  {
                    name: 'content',
                    input: <Textarea label={tCore('content')} />,
                  },
                ]}
              />
            ),
          },
        },
      ]}
      filters={[
        {
          name: 'key',
          input: <TextInput label={tCore('id')} />,
        },
        {
          name: 'lang',
          input: <TextInput label={t('language')} />,
        },
      ]}
      columns={{
        key: { label: tCore('id') },
        lang: { label: t('language') },
        content: { label: tCore('content') },
        updatedDate: {
          label: tCore('updatedDate'),
          render: utils.Render.relativeTime,
        },
      }}
      cellActions={(item) => [
        {
          label: tCore('edit'),
          icon: IconEdit,
          modal: {
            title: tCore('edit'),
            children: (
              <ApiFormGroup
                api={translationApi.update}
                apiParams={{
                  translationId: item.id,
                  key: item.key,
                  lang: item.lang,
                  content: item.content,
                }}
                fields={[
                  {
                    name: 'key',
                    input: <TextInput label={tCore('id')} />,
                  },
                  {
                    name: 'lang',
                    input: <TextInput label={t('language')} />,
                  },
                  {
                    name: 'content',
                    input: <Textarea label={tCore('content')} />,
                  },
                ]}
              />
            ),
          },
        },
        {
          label: tCore('delete'),
          icon: IconTrash,
          modal: ({ closeModal }) => ({
            title: t('deleteTranslation', { key: item.key, lang: item.lang }),
            children: (
              <ApiConfirmFormGroup
                api={translationApi.delete}
                onCancel={closeModal}
                apiParams={{ translationId: item.id }}
              />
            ),
          }),
        },
      ]}
    />
  );
};

export const translationsPage = new PageItem({
  label: <ModuleT module={webModule} k="translations" />,
  path: 'translations',
  icon: IconLanguage,
  element: (
    <IfCanAccessApi api={translationApi.getMany}>
      <Page />
    </IfCanAccessApi>
  ),
});
