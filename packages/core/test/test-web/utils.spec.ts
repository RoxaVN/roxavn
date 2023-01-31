import { utils } from '../../src/web';

describe('utils', () => {
  describe('Render', () => {
    it('datetimeRelative() should work', () => {
      expect(
        utils.Render.relativeTime('2000-03-15T05:20:10.123Z')
      ).toBeTruthy();
    });

    it('datetime() should work', () => {
      expect(utils.Render.datetime('2020-03-15T05:20:10.123Z')).toBeTruthy();
    });

    it('date() should work', () => {
      expect(utils.Render.date('2020-03-15T05:20:10.123Z')).toBeTruthy();
    });
  });
});
