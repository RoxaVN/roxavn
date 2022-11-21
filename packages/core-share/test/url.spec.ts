import { urlUtils } from '../src';

describe('url', () => {
  describe('urlUtils', () => {
    it('removeTrailingSlash() should work', () => {
      expect(urlUtils.removeTrailingSlash('/')).toEqual('/');
      expect(urlUtils.removeTrailingSlash('/test/')).toEqual('/test');
    });

    it('matchPattern() should work', () => {
      expect(urlUtils.matchPattern('/', '')).toBeTruthy();
      expect(urlUtils.matchPattern('/name', '/name/')).toBeTruthy();
      expect(urlUtils.matchPattern('', '/:name')).toBeTruthy();
      expect(urlUtils.matchPattern('/', '/:name')).toBeTruthy();
      expect(urlUtils.matchPattern('/test1', '/test1/:name/')).toBeTruthy();
      expect(urlUtils.matchPattern('/:test', '/:name')).toBeTruthy();
      expect(urlUtils.matchPattern('/:test/', '/:name')).toBeTruthy();
      expect(urlUtils.matchPattern('/name', '/name/abc')).toBeFalsy();

      expect(urlUtils.matchPattern('/', '', false)).toBeFalsy();
      expect(urlUtils.matchPattern('/name', '/name/abc', false)).toBeFalsy();
      expect(urlUtils.matchPattern('/name', '/name/', false)).toBeFalsy();
      expect(urlUtils.matchPattern('/:test/', '/:name', false)).toBeFalsy();
      expect(urlUtils.matchPattern('/', '/:name', false)).toBeTruthy();
      expect(urlUtils.matchPattern('/:test', '/:name', false)).toBeTruthy();
    });

    it('match() should work', () => {
      expect(urlUtils.match('/', '')).toBeTruthy();
      expect(urlUtils.match('/', '/:name')).toBeTruthy();
      expect(urlUtils.match('/test', '/:name')).toBeTruthy();
      expect(urlUtils.match('/test/', '/:name')).toBeTruthy();
      expect(urlUtils.match('/test1', '/test1/:name/')).toBeTruthy();

      expect(urlUtils.match('/', '', false)).toBeFalsy();
      expect(urlUtils.match('/test/', '/:name', false)).toBeFalsy();
      expect(urlUtils.match('/test', '/:name/', false)).toBeFalsy();
      expect(urlUtils.match('/test', '/:name', false)).toBeTruthy();
      expect(urlUtils.match('/', '/:name', false)).toBeTruthy();
    });

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
