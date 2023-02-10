import { Card, SimpleGrid, Image, Text } from '@mantine/core';
import { BaseModule, constants } from '@roxavn/core/base';
import { RolesContext, WebModule } from '@roxavn/core/web';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useOutletContext } from 'react-router-dom';

export const Page = () => {
  const { roles } = useContext(RolesContext);
  const { t } = useTranslation(constants.META_I18N_NAMESPACE);
  const { setWebModule } = useOutletContext<any>();

  useEffect(() => {
    setWebModule(undefined);
  }, []);

  return (
    <SimpleGrid
      cols={6}
      breakpoints={[
        { maxWidth: 980, cols: 4, spacing: 'md' },
        { maxWidth: 755, cols: 3, spacing: 'sm' },
        { maxWidth: 600, cols: 2, spacing: 'sm' },
      ]}
    >
      {roles
        .filter((item) => !item.resourceId)
        .map((item) => (
          <Card key={item.id}>
            <Card.Section>
              <Link to={BaseModule.escapeName(item.resource)}>
                <Image
                  src={WebModule.resolveStaticPath(item.resource, '/icon.svg')}
                  height={160}
                  alt={item.resource}
                />
              </Link>
            </Card.Section>
            <Text weight={500} mt="md" align="center">
              {t(item.resource + '.name')}
            </Text>
          </Card>
        ))}
    </SimpleGrid>
  );
};

export default Page;
