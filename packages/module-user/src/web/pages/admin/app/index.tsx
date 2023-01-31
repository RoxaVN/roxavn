import { Card, SimpleGrid, Image, Text } from '@mantine/core';
import { BaseModule, constants } from '@roxavn/core/share';
import { ApiForm, WebModule } from '@roxavn/core/web';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useOutletContext } from 'react-router-dom';
import { getMyModuleRolesApi } from '../../../../share';

export const Page = () => {
  const { t } = useTranslation(constants.META_I18N_NAMESPACE);
  const { setWebModule } = useOutletContext<any>();

  useEffect(() => {
    setWebModule(undefined);
  }, []);

  return (
    <ApiForm
      fetchOnMount
      api={getMyModuleRolesApi}
      dataRender={({ data }) =>
        data && (
          <SimpleGrid
            cols={6}
            breakpoints={[
              { maxWidth: 980, cols: 4, spacing: 'md' },
              { maxWidth: 755, cols: 3, spacing: 'sm' },
              { maxWidth: 600, cols: 2, spacing: 'sm' },
            ]}
          >
            {data.items.map((item) => (
              <Card key={item.id}>
                <Card.Section>
                  <Link to={BaseModule.escapeName(item.scope)}>
                    <Image
                      src={WebModule.resolveStaticPath(item.scope, '/icon.svg')}
                      height={160}
                      alt={item.scope}
                    />
                  </Link>
                </Card.Section>
                <Text weight={500} mt="md" align="center">
                  {t(item.scope + '.name')}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        )
      }
    />
  );
};

export default Page;
