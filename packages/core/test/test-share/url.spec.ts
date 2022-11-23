import { urlUtils } from '../../src/share';

describe('url', () => {
  describe('urlUtils', () => {
    it('gen() should work', () => {
      expect(urlUtils.gen('/t/:name', { name: 'hai' })).toEqual('/t/hai');
      expect(
        urlUtils.gen('/t/:name/s/:age', { name: 'hai', age: 23, home: 'vn' })
      ).toEqual('/t/hai/s/23');

      expect(urlUtils.gen('/t/name', { name: 'hai' })).toEqual('/t/name');
      expect(urlUtils.gen('/t/n:ame', { name: 'hai' })).toEqual('/t/n:ame');
      expect(urlUtils.gen('/t/:name', { user: 'hai' })).toEqual('/t/');
      expect(urlUtils.gen('/t/:name/s', { user: 'hai' })).toEqual('/t//s');
    });
  });
});
