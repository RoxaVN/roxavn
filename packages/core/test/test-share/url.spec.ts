import { urlUtils } from '../../src/base';

describe('url', () => {
  describe('urlUtils', () => {
    it('gen() should work', () => {
      expect(urlUtils.generatePath('/t/:name', { name: 'hai' })).toEqual(
        '/t/hai'
      );
      expect(
        urlUtils.generatePath('/t/:name/s/:age', {
          name: 'hai',
          age: 23,
          home: 'vn',
        })
      ).toEqual('/t/hai/s/23');

      expect(urlUtils.generatePath('/t/name', { name: 'hai' })).toEqual(
        '/t/name'
      );
      expect(urlUtils.generatePath('/t/n:ame', { name: 'hai' })).toEqual(
        '/t/n:ame'
      );
      expect(urlUtils.generatePath('/t/:name', { user: 'hai' })).toEqual('/t/');
      expect(urlUtils.generatePath('/t/:name/s', { user: 'hai' })).toEqual(
        '/t//s'
      );
    });
  });
});
