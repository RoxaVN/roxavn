import { Pagination } from './api';

const paginationUtils = {
  create: (page: number, pageSize: number, totalItems: number): Pagination => ({
    page,
    pageSize,
    totalItems: totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
  }),
};

export { paginationUtils };
