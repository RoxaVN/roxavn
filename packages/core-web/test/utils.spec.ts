import { utils } from '../src';

describe('utils', () => {
  describe('Render', () => {
    it('datetimeRelative() should work', () => {
      expect(
        utils.Render.datetimeRelative('2000-03-15T05:20:10.123Z')
      ).toBeTruthy();
      expect(() => utils.Render.datetimeRelative('invalid')).toThrow();
    });

    it('datetime() should work', () => {
      expect(utils.Render.datetime('2020-03-15T05:20:10.123Z')).toBeTruthy();
      expect(() => utils.Render.datetime('invalid')).toThrow();
    });

    it('date() should work', () => {
      expect(utils.Render.date('2020-03-15T05:20:10.123Z')).toBeTruthy();
      expect(() => utils.Render.date('invalid')).toThrow();
    });
  });
});
