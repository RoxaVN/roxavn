import { paginationUtils } from '../../src/share';

describe('paginationUtils', () => {
  describe('create', () => {
    it('should work with required props', () => {
      const p1 = paginationUtils.create(1, 10, 34);
      expect(p1.totalPages).toEqual(4);

      const p2 = paginationUtils.create(1, 10, 40);
      expect(p2.totalPages).toEqual(4);
    });
  });
});
