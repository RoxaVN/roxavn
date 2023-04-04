import { Pagination, PaginationProps } from '@mantine/core';
import { Link, useSearchParams } from '@remix-run/react';

import { constants, Pagination as PaginationType } from '../../base';

export interface PaginationLinksProps
  extends Omit<PaginationProps, 'total' | 'value'> {
  data: PaginationType;
  locationKey?: string;
}

export const PaginationLinks = ({
  data,
  locationKey,
  ...props
}: PaginationLinksProps) => {
  const [searchParams] = useSearchParams();
  const genLink = (page: number) => {
    let href: string;
    if (
      locationKey &&
      searchParams.get(constants.LOCATION_SEARCH_KEY) === locationKey
    ) {
      searchParams.set('page', page.toString());
      href = '?' + searchParams.toString();
    } else {
      href = '?page=' + page;
      if (locationKey) {
        href += '&' + constants.LOCATION_SEARCH_KEY + '=' + locationKey;
      }
    }
    return { component: Link, href: href };
  };
  const total = Math.ceil(data.totalItems / data.pageSize);

  return (
    <Pagination
      total={total}
      value={data.page}
      position="center"
      getItemProps={genLink}
      getControlProps={(control) => {
        if (control === 'first') {
          return genLink(1);
        }
        if (control === 'last') {
          return genLink(total);
        }
        if (control === 'next') {
          return genLink(data.page + 1);
        }
        if (control === 'previous') {
          return genLink(data.page - 1);
        }
        return {};
      }}
      {...props}
    />
  );
};
