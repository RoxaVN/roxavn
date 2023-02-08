import {
  Api,
  InferApiCollectionItem,
  Empty,
  PaginatedCollection,
} from '../../src/base';

describe('api', () => {
  describe('ApiCollectionItem', () => {
    it('should work', () => {
      const api: Api<any, PaginatedCollection<number>> = {
        path: '/',
        method: 'GET',
      };
      const number: InferApiCollectionItem<typeof api> = 3;
      expect(number).toBeTruthy();
    });
  });

  describe('Api', () => {
    it('should work', () => {
      expect({
        path: '/',
        method: 'GET',
      } as Api<Empty, PaginatedCollection<number>>).toBeTruthy();

      expect({
        path: '/',
        method: 'GET',
      } as Api<{ 1: number }, Empty>).toBeTruthy();
    });
  });
});
